import { Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { v4 as uuidv4 } from 'uuid';
import {
  IVideoProvider,
  VideoTaskParams,
  VideoTaskResult,
  VideoTaskStatus,
  VideoTaskStatusResponse,
} from '../../common/interfaces/ivideo-provider.interface';

/**
 * Seedance API endpoint configuration.
 * Based on research from docs.seedance.com:
 * - POST /api/v1/video/submit - Submit a video generation task
 * - GET /api/v1/video/{taskId} - Query task status
 * - POST /api/v1/video/{taskId}/cancel - Cancel a task
 * - POST /api/v1/video/{taskId}/delete - Delete a task
 */
interface SeedanceSubmitRequest {
  prompt: string;
  image_url?: string;
  video_url?: string;
  model?: string;
  duration?: number;
  resolution?: string;
  [key: string]: any;
}

interface SeedanceTaskResponse {
  code: number;
  message: string;
  data?: {
    task_id: string;
    status: string;
    created_at: string;
    [key: string]: any;
  };
}

interface SeedanceStatusResponse {
  code: number;
  message: string;
  data?: {
    task_id: string;
    status: string;
    progress: number;
    output_url?: string;
    thumbnail_url?: string;
    error_message?: string;
    created_at: string;
    completed_at?: string;
    [key: string]: any;
  };
}

@Injectable()
export class SeedanceProvider implements IVideoProvider {
  private readonly logger = new Logger(SeedanceProvider.name);
  private readonly baseUrl: string;
  private readonly apiKey: string;

  constructor(private readonly httpService: HttpService) {
    this.baseUrl = process.env.SEEDANCE_API_BASE_URL || 'https://api.console.seedance.com';
    this.apiKey = process.env.SEEDANCE_API_KEY || '';
    
    if (!this.apiKey) {
      this.logger.warn('SEEDANCE_API_KEY not set. Provider will not function.');
    }
  }

  getProviderName(): string {
    return 'seedance';
  }

  async submitTask(params: VideoTaskParams): Promise<VideoTaskResult> {
    this.logger.log(`Submitting video generation task to Seedance`);

    const requestBody: SeedanceSubmitRequest = {
      prompt: params.prompt,
      image_url: params.referenceImageUrl,
      video_url: params.referenceVideoUrl,
      model: params.model || 'seedance-v1',
      duration: params.duration || 5,
      resolution: params.resolution || '720p',
    };

    try {
      const response = await firstValueFrom(
        this.httpService.post<SeedanceTaskResponse>(
          `${this.baseUrl}/api/v1/video/submit`,
          requestBody,
          {
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${this.apiKey}`,
            },
          },
        ),
      );

      const { code, data, message } = response.data;

      if (code !== 0 || !data) {
        throw new Error(`Seedance API error: ${message} (code: ${code})`);
      }

      const result: VideoTaskResult = {
        taskId: data.task_id,
        status: this.mapStatus(data.status),
      };

      this.logger.log(`Seedance task submitted: ${data.task_id}`);
      return result;
    } catch (error) {
      this.logger.error(`Failed to submit task to Seedance: ${(error as Error).message}`);
      throw error;
    }
  }

  async pollStatus(taskId: string): Promise<VideoTaskStatusResponse> {
    this.logger.debug(`Polling Seedance task status: ${taskId}`);

    try {
      const response = await firstValueFrom(
        this.httpService.get<SeedanceStatusResponse>(
          `${this.baseUrl}/api/v1/video/${taskId}`,
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
            },
          },
        ),
      );

      const { code, data, message } = response.data;

      if (code !== 0 || !data) {
        throw new Error(`Seedance API error: ${message} (code: ${code})`);
      }

      const result: VideoTaskStatusResponse = {
        taskId: data.task_id,
        status: this.mapStatus(data.status),
        progress: data.progress || 0,
        outputUrl: data.output_url,
        errorMessage: data.error_message,
        createdAt: data.created_at,
        completedAt: data.completed_at,
      };

      return result;
    } catch (error) {
      this.logger.error(`Failed to poll Seedance task ${taskId}: ${(error as Error).message}`);
      throw error;
    }
  }

  async cancelTask(taskId: string): Promise<void> {
    this.logger.log(`Cancelling Seedance task: ${taskId}`);

    try {
      await firstValueFrom(
        this.httpService.post(
          `${this.baseUrl}/api/v1/video/${taskId}/cancel`,
          {},
          {
            headers: {
              'Authorization': `Bearer ${this.apiKey}`,
            },
          },
        ),
      );
      this.logger.log(`Seedance task cancelled: ${taskId}`);
    } catch (error) {
      this.logger.error(`Failed to cancel Seedance task ${taskId}: ${(error as Error).message}`);
      throw error;
    }
  }

  /**
   * Map Seedance API status strings to our internal VideoTaskStatus enum.
   * Seedance statuses: pending, running, succeeded, failed, cancelled
   */
  private mapStatus(seedanceStatus: string): VideoTaskStatus {
    const statusMap: Record<string, VideoTaskStatus> = {
      pending: VideoTaskStatus.PENDING,
      running: VideoTaskStatus.PROCESSING,
      processing: VideoTaskStatus.PROCESSING,
      queued: VideoTaskStatus.PENDING,
      succeeded: VideoTaskStatus.COMPLETED,
      completed: VideoTaskStatus.COMPLETED,
      failed: VideoTaskStatus.FAILED,
      cancelled: VideoTaskStatus.CANCELLED,
      canceled: VideoTaskStatus.CANCELLED,
    };

    return statusMap[seedanceStatus?.toLowerCase()] || VideoTaskStatus.PENDING;
  }
}
