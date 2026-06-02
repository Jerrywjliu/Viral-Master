import { v4 as uuidv4 } from 'uuid';

export enum ChatSessionStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  CLOSED = 'closed',
}

export class ChatSession {
  id: string;
  title: string;
  agentId?: string;
  characterId?: string;
  status: ChatSessionStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<ChatSession>) {
    this.id = partial.id || uuidv4();
    this.title = partial.title || 'New Chat';
    this.agentId = partial.agentId;
    this.characterId = partial.characterId;
    this.status = partial.status || ChatSessionStatus.ACTIVE;
    this.metadata = partial.metadata || {};
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
  }
}
