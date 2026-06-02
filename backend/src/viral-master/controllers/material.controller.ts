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
import { MaterialService } from '../services/material.service';
import { Material, MaterialStatus, MaterialType } from '../entities/material.entity';
import { ApiResponse } from '../../common/dto/api-response';

@Controller('materials')
export class MaterialController {
  constructor(private readonly materialService: MaterialService) {}

  @Post()
  async create(@Body() body: Partial<Material>): Promise<ApiResponse<Material>> {
    const material = await this.materialService.create(body);
    return ApiResponse.created(material, 'Material created');
  }

  @Get()
  async findAll(
    @Query('type') type?: MaterialType,
    @Query('status') status?: MaterialStatus,
  ): Promise<ApiResponse<Material[]>> {
    const materials = await this.materialService.findAll({ type, status });
    return ApiResponse.success(materials);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<Material>> {
    const material = await this.materialService.findById(id);
    return ApiResponse.success(material);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Material>,
  ): Promise<ApiResponse<Material>> {
    const material = await this.materialService.update(id, body);
    return ApiResponse.success(material, 'Material updated');
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.materialService.delete(id);
    return ApiResponse.success(null as any, 'Material deleted');
  }
}
