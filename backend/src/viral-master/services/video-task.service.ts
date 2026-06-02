import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { VideoTask, VideoTaskStatus, VideoTaskType } from '../entities/video-task.entity';
import { IVideoProvider, VideoTaskParams } from '../../common/interfaces/ivideo-provider.interface';

@Injectable()
export class VideoTaskService {
  private readonly logger = new Logger(VideoTaskService.name);
  private tasks: Map<string, VideoTask> = new Map();

  // Provider registry
  private providers: Map<string, IVideoProvider> = new Map();

  registerProvider(provider: IVideoProvider): void {
    this.providers.set(provider.getProviderName(), provider);
    this.logger.log(`Video provider registered: ${provider.getProviderName()}`);
  }

  async createTask(partial: Partial<VideoTask>): Promise<VideoTask> {
    const task = new VideoTask(partial);
    this.tasks.set(task.id, task);
    this.logger.log(`Video task created: ${task.id} - type: ${task.type}`);
    return task;
  }

  async findById(id: string): Promise<VideoTask> {
    const task = this.tasks.get(id);
    if (!task) {
      throw new NotFoundException(`Video task ${id} not found`);
    }
    return task;
  }

  async findAll(filter?: { status?: VideoTaskStatus; type?: VideoTaskType }): Promise<VideoTask[]> {
    let results = Array.from(this.tasks.values());
    if (filter?.status) {
      results = results.filter((t) => t.status === filter.status);
    }
    if (filter?.type) {
      results = results.filter((t) => t.type === filter.type);
    }
    return results.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
  }

  async update(id: string, updates: Partial<VideoTask>): Promise<VideoTask> {
    const task = await this.findById(id);
    Object.assign(task, { ...updates, updatedAt: new Date() });
    if (updates.status === VideoTaskStatus.COMPLETED || updates.status === VideoTaskStatus.FAILED) {
      task.completedAt = new Date();
    }
    this.tasks.set(id, task);
    return task;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    this.tasks.delete(id);
    this.logger.log(`Video task deleted: ${id}`);
  }

  /**
   * Submit a video generation task to the specified provider.
   */
  async submitToProvider(
    taskId: string,
    providerName: string,
    params: VideoTaskParams,
  ): Promise<VideoTask> {
    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new NotFoundException(`Video provider "${providerName}" not found. Available: ${Array.from(this.providers.keys()).join(', ')}`);
    }

    const task = await this.findById(taskId);
    
    // Update task with provider info
    task.status = VideoTaskStatus.PROCESSING;
    task.providerName = providerName;
    task.updatedAt = new Date();
    this.tasks.set(taskId, task);

    try {
      const result = await provider.submitTask(params);
      
      task.providerTaskId = result.taskId;
      task.status = this.mapProviderStatus(result.status);
      this.tasks.set(taskId, task);

      this.logger.log(`Task ${taskId} submitted to ${providerName}, provider task ID: ${result.taskId}`);
    } catch (error) {
      task.status = VideoTaskStatus.FAILED;
      task.errorMessage = (error as Error).message;
      task.completedAt = new Date();
      this.tasks.set(taskId, task);
      throw error;
    }

    return task;
  }

  /**
   * Poll the status of a task from its provider.
   */
  async pollProviderStatus(taskId: string): Promise<VideoTask> {
    const task = await this.findById(taskId);
    
    if (!task.providerName || !task.providerTaskId) {
      throw new Error(`Task ${taskId} has not been submitted to any provider`);
    }

    const provider = this.providers.get(task.providerName);
    if (!provider) {
      throw new NotFoundException(`Provider "${task.providerName}" not found`);
    }

    const statusResponse = await provider.pollStatus(task.providerTaskId);
    
    task.status = this.mapProviderStatus(statusResponse.status);
    task.progress = statusResponse.progress;
    
    if (statusResponse.outputUrl) {
      task.outputUrl = statusResponse.outputUrl;
    }
    if (statusResponse.errorMessage) {
      task.errorMessage = statusResponse.errorMessage;
    }
    if (task.status === VideoTaskStatus.COMPLETED || task.status === VideoTaskStatus.FAILED) {
      task.completedAt = new Date();
    }
    task.updatedAt = new Date();
    this.tasks.set(taskId, task);

    return task;
  }

  /**
   * Cancel a task on its provider.
   */
  async cancelTask(taskId: string): Promise<VideoTask> {
    const task = await this.findById(taskId);
    
    if (task.providerName && task.providerTaskId) {
      const provider = this.providers.get(task.providerName);
      if (provider) {
        await provider.cancelTask(task.providerTaskId);
      }
    }

    task.status = VideoTaskStatus.CANCELLED;
    task.completedAt = new Date();
    task.updatedAt = new Date();
    this.tasks.set(taskId, task);

    this.logger.log(`Video task cancelled: ${taskId}`);
    return task;
  }

  private mapProviderStatus(status: any): VideoTaskStatus {
    const statusMap: Record<string, VideoTaskStatus> = {
      pending: VideoTaskStatus.PENDING,
      queued: VideoTaskStatus.QUEUED,
      processing: VideoTaskStatus.PROCESSING,
      completed: VideoTaskStatus.COMPLETED,
      failed: VideoTaskStatus.FAILED,
      cancelled: VideoTaskStatus.CANCELLED,
    };
    return statusMap[status?.toLowerCase()] || VideoTaskStatus.PENDING;
  }
}
