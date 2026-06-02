import { v4 as uuidv4 } from 'uuid';

export enum VideoTaskStatus {
  PENDING = 'pending',
  QUEUED = 'queued',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

export enum VideoTaskType {
  TEXT_TO_VIDEO = 'text_to_video',
  IMAGE_TO_VIDEO = 'image_to_video',
  VIDEO_TO_VIDEO = 'video_to_video',
}

export class VideoTask {
  id: string;
  type: VideoTaskType;
  status: VideoTaskStatus;
  prompt: string;
  agentId?: string;
  characterId?: string;
  materialId?: string;
  referenceImageUrl?: string;
  referenceVideoUrl?: string;
  model?: string;
  duration?: number;
  resolution?: string;
  outputUrl?: string;
  thumbnailUrl?: string;
  progress: number;
  providerTaskId?: string;
  providerName?: string;
  errorMessage?: string;
  retryCount: number;
  metadata?: Record<string, any>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;
  completedAt?: Date;

  constructor(partial: Partial<VideoTask>) {
    this.id = partial.id || uuidv4();
    this.type = partial.type || VideoTaskType.TEXT_TO_VIDEO;
    this.status = partial.status || VideoTaskStatus.PENDING;
    this.prompt = partial.prompt || '';
    this.agentId = partial.agentId;
    this.characterId = partial.characterId;
    this.materialId = partial.materialId;
    this.referenceImageUrl = partial.referenceImageUrl;
    this.referenceVideoUrl = partial.referenceVideoUrl;
    this.model = partial.model;
    this.duration = partial.duration;
    this.resolution = partial.resolution;
    this.outputUrl = partial.outputUrl;
    this.thumbnailUrl = partial.thumbnailUrl;
    this.progress = partial.progress || 0;
    this.providerTaskId = partial.providerTaskId;
    this.providerName = partial.providerName;
    this.errorMessage = partial.errorMessage;
    this.retryCount = partial.retryCount || 0;
    this.metadata = partial.metadata || {};
    this.createdBy = partial.createdBy;
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
    this.completedAt = partial.completedAt;
  }
}
