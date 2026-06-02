import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { VideoTaskService } from '../services/video-task.service';
import { VideoTask, VideoTaskStatus, VideoTaskType } from '../entities/video-task.entity';
import { VideoTaskParams } from '../../common/interfaces/ivideo-provider.interface';
import { ApiResponse } from '../../common/dto/api-response';

@Controller('video-tasks')
export class VideoController {
  constructor(private readonly videoTaskService: VideoTaskService) {}

  @Post()
  async create(@Body() body: Partial<VideoTask>): Promise<ApiResponse<VideoTask>> {
    const task = await this.videoTaskService.createTask(body);
    return ApiResponse.created(task, 'Video task created');
  }

  @Post(':id/submit')
  async submitToProvider(
    @Param('id') id: string,
    @Body() body: { providerName: string; params: VideoTaskParams },
  ): Promise<ApiResponse<VideoTask>> {
    const task = await this.videoTaskService.submitToProvider(
      id,
      body.providerName,
      body.params,
    );
    return ApiResponse.success(task, 'Task submitted to provider');
  }

  @Post(':id/poll')
  async pollStatus(@Param('id') id: string): Promise<ApiResponse<VideoTask>> {
    const task = await this.videoTaskService.pollProviderStatus(id);
    return ApiResponse.success(task, 'Status polled');
  }

  @Post(':id/cancel')
  async cancel(@Param('id') id: string): Promise<ApiResponse<VideoTask>> {
    const task = await this.videoTaskService.cancelTask(id);
    return ApiResponse.success(task, 'Task cancelled');
  }

  @Get()
  async findAll(
    @Query('status') status?: VideoTaskStatus,
    @Query('type') type?: VideoTaskType,
  ): Promise<ApiResponse<VideoTask[]>> {
    const tasks = await this.videoTaskService.findAll({ status, type });
    return ApiResponse.success(tasks);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<VideoTask>> {
    const task = await this.videoTaskService.findById(id);
    return ApiResponse.success(task);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<VideoTask>,
  ): Promise<ApiResponse<VideoTask>> {
    const task = await this.videoTaskService.update(id, body);
    return ApiResponse.success(task, 'Task updated');
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.videoTaskService.delete(id);
    return ApiResponse.success(null as any, 'Video task deleted');
  }
}
