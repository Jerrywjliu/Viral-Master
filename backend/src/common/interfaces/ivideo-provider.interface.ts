/**
 * Parameters for submitting a video generation task.
 */
export interface VideoTaskParams {
  /**
   * The prompt describing the video content.
   */
  prompt: string;

  /**
   * Optional reference image URL for image-to-video generation.
   */
  referenceImageUrl?: string;

  /**
   * Optional reference video URL for video-to-video generation.
   */
  referenceVideoUrl?: string;

  /**
   * Model or style to use for generation.
   */
  model?: string;

  /**
   * Duration of the video in seconds.
   */
  duration?: number;

  /**
   * Resolution/quality setting.
   */
  resolution?: string;

  /**
   * Additional provider-specific parameters.
   */
  [key: string]: any;
}

/**
 * Status of a video generation task.
 */
export enum VideoTaskStatus {
  PENDING = 'pending',
  PROCESSING = 'processing',
  COMPLETED = 'completed',
  FAILED = 'failed',
  CANCELLED = 'cancelled',
}

/**
 * Result of a video generation task submission.
 */
export interface VideoTaskResult {
  /**
   * Provider-specific task ID.
   */
  taskId: string;

  /**
   * Current status of the task.
   */
  status: VideoTaskStatus;

  /**
   * Estimated time to completion in seconds, if available.
   */
  estimatedTime?: number;
}

/**
 * Detailed task status response.
 */
export interface VideoTaskStatusResponse {
  taskId: string;
  status: VideoTaskStatus;
  progress: number; // 0-100
  outputUrl?: string;
  errorMessage?: string;
  createdAt: string;
  completedAt?: string;
}

/**
 * Interface for video generation providers (e.g., Seedance).
 */
export interface IVideoProvider {
  /**
   * Submit a new video generation task.
   */
  submitTask(params: VideoTaskParams): Promise<VideoTaskResult>;

  /**
   * Poll the current status of a video generation task.
   */
  pollStatus(taskId: string): Promise<VideoTaskStatusResponse>;

  /**
   * Cancel a video generation task.
   */
  cancelTask(taskId: string): Promise<void>;

  /**
   * Get the provider name identifier.
   */
  getProviderName(): string;
}
