import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Workspace, WorkspaceStatus } from '../entities/works-dir.entity';

@Injectable()
export class WorkspaceService {
  private readonly logger = new Logger(WorkspaceService.name);
  private workspaces: Map<string, Workspace> = new Map();

  async create(partial: Partial<Workspace>): Promise<Workspace> {
    const workspace = new Workspace(partial);
    this.workspaces.set(workspace.id, workspace);
    this.logger.log(`Workspace created: ${workspace.id} - "${workspace.name}"`);
    return workspace;
  }

  async findById(id: string): Promise<Workspace> {
    const workspace = this.workspaces.get(id);
    if (!workspace) {
      throw new NotFoundException(`Workspace ${id} not found`);
    }
    return workspace;
  }

  async findAll(filter?: { status?: WorkspaceStatus }): Promise<Workspace[]> {
    let results = Array.from(this.workspaces.values());
    if (filter?.status) {
      results = results.filter((w) => w.status === filter.status);
    }
    return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async update(id: string, updates: Partial<Workspace>): Promise<Workspace> {
    const workspace = await this.findById(id);
    Object.assign(workspace, { ...updates, updatedAt: new Date() });
    this.workspaces.set(id, workspace);
    return workspace;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    this.workspaces.delete(id);
    this.logger.log(`Workspace deleted: ${id}`);
  }
}
