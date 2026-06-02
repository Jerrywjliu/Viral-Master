import { v4 as uuidv4 } from 'uuid';

export enum MaterialType {
  IMAGE = 'image',
  VIDEO = 'video',
  AUDIO = 'audio',
  DOCUMENT = 'document',
  OTHER = 'other',
}

export enum MaterialStatus {
  UPLOADING = 'uploading',
  READY = 'ready',
  PROCESSING = 'processing',
  ERROR = 'error',
}

export class Material {
  id: string;
  type: MaterialType;
  status: MaterialStatus;
  fileName: string;
  originalName: string;
  mimeType: string;
  size: number;
  url: string;
  thumbnailUrl?: string;
  width?: number;
  height?: number;
  duration?: number;
  metadata?: Record<string, any>;
  tags?: string[];
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Material>) {
    this.id = partial.id || uuidv4();
    this.type = partial.type || MaterialType.OTHER;
    this.status = partial.status || MaterialStatus.UPLOADING;
    this.fileName = partial.fileName || '';
    this.originalName = partial.originalName || '';
    this.mimeType = partial.mimeType || 'application/octet-stream';
    this.size = partial.size || 0;
    this.url = partial.url || '';
    this.thumbnailUrl = partial.thumbnailUrl;
    this.width = partial.width;
    this.height = partial.height;
    this.duration = partial.duration;
    this.metadata = partial.metadata || {};
    this.tags = partial.tags || [];
    this.createdBy = partial.createdBy;
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
  }
}
