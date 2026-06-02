import { Injectable, Logger, BadRequestException } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';
import { v4 as uuidv4 } from 'uuid';

export interface ChunkInfo {
  fileId: string;
  chunkIndex: number;
  totalChunks: number;
  receivedSize: number;
  fileName?: string;
  mimeType?: string;
}

export interface UploadProgress {
  fileId: string;
  receivedChunks: number[];
  totalChunks: number;
  progress: number; // 0-100
  fileName?: string;
}

export interface UploadResult {
  materialId: string;
  url: string;
  fileName: string;
  size: number;
}

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly uploadDir: string;
  private readonly chunkDir: string;

  // In-memory tracking of chunk uploads
  private uploadSessions = new Map<
    string,
    {
      chunks: Map<number, Buffer>;
      totalChunks: number;
      fileName?: string;
      mimeType?: string;
      createdAt: Date;
    }
  >();

  constructor() {
    this.uploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), 'uploads');
    this.chunkDir = path.join(this.uploadDir, 'chunks');

    // Ensure upload directories exist
    if (!fs.existsSync(this.uploadDir)) {
      fs.mkdirSync(this.uploadDir, { recursive: true });
    }
    if (!fs.existsSync(this.chunkDir)) {
      fs.mkdirSync(this.chunkDir, { recursive: true });
    }
  }

  /**
   * Upload a chunk of a file.
   * Returns the current upload progress.
   */
  async uploadChunk(
    fileId: string,
    chunkIndex: number,
    totalChunks: number,
    chunkData: Buffer,
    fileName?: string,
    mimeType?: string,
  ): Promise<UploadProgress> {
    if (chunkIndex < 0 || chunkIndex >= totalChunks) {
      throw new BadRequestException(
        `Invalid chunk index ${chunkIndex}. Must be between 0 and ${totalChunks - 1}.`,
      );
    }

    // Get or create session
    let session = this.uploadSessions.get(fileId);
    if (!session) {
      session = {
        chunks: new Map(),
        totalChunks,
        fileName,
        mimeType,
        createdAt: new Date(),
      };
      this.uploadSessions.set(fileId, session);
    }

    // Validate totalChunks consistency
    if (session.totalChunks !== totalChunks) {
      throw new BadRequestException(
        `Inconsistent totalChunks: expected ${session.totalChunks}, got ${totalChunks}.`,
      );
    }

    // Store chunk in memory and on disk
    session.chunks.set(chunkIndex, chunkData);

    // Also save chunk to disk for persistence
    const chunkFilePath = path.join(this.chunkDir, `${fileId}_chunk_${chunkIndex}`);
    await fs.promises.writeFile(chunkFilePath, chunkData);

    this.logger.debug(
      `Chunk ${chunkIndex + 1}/${totalChunks} received for file ${fileId}`,
    );

    return this.getProgress(fileId);
  }

  /**
   * Complete the upload by assembling all chunks.
   * Returns the final upload result with material ID and URL.
   */
  async completeUpload(fileId: string, totalChunks: number, fileName?: string): Promise<UploadResult> {
    const session = this.uploadSessions.get(fileId);

    if (!session) {
      throw new BadRequestException(`Upload session ${fileId} not found. Start upload first.`);
    }

    if (session.chunks.size !== totalChunks) {
      throw new BadRequestException(
        `Incomplete upload: received ${session.chunks.size} of ${totalChunks} chunks.`,
      );
    }

    // Assemble all chunks in order
    const chunks: Buffer[] = [];
    for (let i = 0; i < totalChunks; i++) {
      const chunk = session.chunks.get(i);
      if (!chunk) {
        throw new BadRequestException(`Missing chunk ${i} for file ${fileId}.`);
      }
      chunks.push(chunk);
    }

    const assembledBuffer = Buffer.concat(chunks);
    const finalFileName = fileName || session.fileName || `${fileId}`;
    const safeFileName = this.sanitizeFileName(finalFileName);
    const materialId = uuidv4();
    
    // Store the file in the uploads directory
    const fileExt = path.extname(safeFileName);
    const storedFileName = `${materialId}${fileExt}`;
    const filePath = path.join(this.uploadDir, storedFileName);
    
    await fs.promises.writeFile(filePath, assembledBuffer);

    // Calculate file size
    const stats = await fs.promises.stat(filePath);
    const size = stats.size;

    // Clean up chunk files from disk
    for (let i = 0; i < totalChunks; i++) {
      const chunkFilePath = path.join(this.chunkDir, `${fileId}_chunk_${i}`);
      try {
        await fs.promises.unlink(chunkFilePath);
      } catch (err) {
        this.logger.warn(`Failed to clean up chunk ${i}: ${(err as Error).message}`);
      }
    }

    // Clean up session
    this.uploadSessions.delete(fileId);

    const url = `/uploads/${storedFileName}`;

    this.logger.log(`File upload completed: ${safeFileName} (${size} bytes) -> ${url}`);

    return {
      materialId,
      url,
      fileName: safeFileName,
      size,
    };
  }

  /**
   * Get the current upload progress for a file ID.
   */
  getProgress(fileId: string): UploadProgress {
    const session = this.uploadSessions.get(fileId);
    if (!session) {
      return {
        fileId,
        receivedChunks: [],
        totalChunks: 0,
        progress: 0,
      };
    }

    const receivedChunks = Array.from(session.chunks.keys()).sort((a, b) => a - b);
    const progress = Math.round((receivedChunks.length / session.totalChunks) * 100);

    return {
      fileId,
      receivedChunks,
      totalChunks: session.totalChunks,
      progress,
      fileName: session.fileName,
    };
  }

  /**
   * Abort and cleanup an upload session.
   */
  async abortUpload(fileId: string): Promise<void> {
    const session = this.uploadSessions.get(fileId);
    if (session) {
      // Clean up chunk files
      for (const chunkIndex of session.chunks.keys()) {
        const chunkFilePath = path.join(this.chunkDir, `${fileId}_chunk_${chunkIndex}`);
        try {
          await fs.promises.unlink(chunkFilePath);
        } catch {
          // Ignore cleanup errors
        }
      }
      this.uploadSessions.delete(fileId);
      this.logger.log(`Upload ${fileId} aborted and cleaned up.`);
    }
  }

  /**
   * Get all active upload sessions.
   */
  getActiveUploads(): UploadProgress[] {
    const uploads: UploadProgress[] = [];
    for (const [fileId, session] of this.uploadSessions.entries()) {
      uploads.push(this.getProgress(fileId));
    }
    return uploads;
  }

  private sanitizeFileName(fileName: string): string {
    // Remove path separators and potentially dangerous characters
    return fileName.replace(/[<>:"/\\|?*]/g, '_').replace(/\s+/g, '_');
  }
}
