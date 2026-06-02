import { v4 as uuidv4 } from 'uuid';

export enum AgentStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  BUSY = 'busy',
  ERROR = 'error',
}

export class Agent {
  id: string;
  name: string;
  description?: string;
  status: AgentStatus;
  systemPrompt?: string;
  modelConfig?: Record<string, any>;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Agent>) {
    this.id = partial.id || uuidv4();
    this.name = partial.name || '';
    this.description = partial.description;
    this.status = partial.status || AgentStatus.ACTIVE;
    this.systemPrompt = partial.systemPrompt;
    this.modelConfig = partial.modelConfig || {};
    this.metadata = partial.metadata || {};
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
  }
}
