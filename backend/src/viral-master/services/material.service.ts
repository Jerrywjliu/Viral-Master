import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Material, MaterialStatus, MaterialType } from '../entities/material.entity';

@Injectable()
export class MaterialService {
  private readonly logger = new Logger(MaterialService.name);
  private materials: Map<string, Material> = new Map();

  async create(partial: Partial<Material>): Promise<Material> {
    const material = new Material(partial);
    this.materials.set(material.id, material);
    this.logger.log(`Material created: ${material.id} - "${material.originalName}"`);
    return material;
  }

  async findById(id: string): Promise<Material> {
    const material = this.materials.get(id);
    if (!material) {
      throw new NotFoundException(`Material ${id} not found`);
    }
    return material;
  }

  async findAll(filter?: { type?: MaterialType; status?: MaterialStatus }): Promise<Material[]> {
    let results = Array.from(this.materials.values());
    if (filter?.type) {
      results = results.filter((m) => m.type === filter.type);
    }
    if (filter?.status) {
      results = results.filter((m) => m.status === filter.status);
    }
    return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async update(id: string, updates: Partial<Material>): Promise<Material> {
    const material = await this.findById(id);
    Object.assign(material, { ...updates, updatedAt: new Date() });
    this.materials.set(id, material);
    return material;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    this.materials.delete(id);
    this.logger.log(`Material deleted: ${id}`);
  }
}
