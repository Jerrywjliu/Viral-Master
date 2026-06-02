import { v4 as uuidv4 } from 'uuid';

export enum WorkspaceStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

export class Workspace {
  id: string;
  name: string;
  description?: string;
  status: WorkspaceStatus;
  settings?: Record<string, any>;
  metadata?: Record<string, any>;
  createdBy?: string;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Workspace>) {
    this.id = partial.id || uuidv4();
    this.name = partial.name || 'New Workspace';
    this.description = partial.description;
    this.status = partial.status || WorkspaceStatus.ACTIVE;
    this.settings = partial.settings || {};
    this.metadata = partial.metadata || {};
    this.createdBy = partial.createdBy;
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
  }
}
