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
import { WorkspaceService } from '../services/workspace.service';
import { Workspace, WorkspaceStatus } from '../entities/works-dir.entity';
import { ApiResponse } from '../../common/dto/api-response';

@Controller('workspaces')
export class WorkspaceController {
  constructor(private readonly workspaceService: WorkspaceService) {}

  @Post()
  async create(@Body() body: Partial<Workspace>): Promise<ApiResponse<Workspace>> {
    const workspace = await this.workspaceService.create(body);
    return ApiResponse.created(workspace, 'Workspace created');
  }

  @Get()
  async findAll(
    @Query('status') status?: WorkspaceStatus,
  ): Promise<ApiResponse<Workspace[]>> {
    const workspaces = await this.workspaceService.findAll({ status });
    return ApiResponse.success(workspaces);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<Workspace>> {
    const workspace = await this.workspaceService.findById(id);
    return ApiResponse.success(workspace);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Workspace>,
  ): Promise<ApiResponse<Workspace>> {
    const workspace = await this.workspaceService.update(id, body);
    return ApiResponse.success(workspace, 'Workspace updated');
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.workspaceService.delete(id);
    return ApiResponse.success(null as any, 'Workspace deleted');
  }
}
