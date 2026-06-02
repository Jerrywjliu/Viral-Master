import { v4 as uuidv4 } from 'uuid';

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
}

export enum MessageType {
  TEXT = 'text',
  IMAGE = 'image',
  VIDEO = 'video',
  FILE = 'file',
}

export class ChatMessage {
  id: string;
  sessionId: string;
  role: MessageRole;
  type: MessageType;
  content: string;
  metadata?: Record<string, any>;
  tokenCount?: number;
  createdAt: Date;

  constructor(partial: Partial<ChatMessage>) {
    this.id = partial.id || uuidv4();
    this.sessionId = partial.sessionId || '';
    this.role = partial.role || MessageRole.USER;
    this.type = partial.type || MessageType.TEXT;
    this.content = partial.content || '';
    this.metadata = partial.metadata || {};
    this.tokenCount = partial.tokenCount;
    this.createdAt = partial.createdAt || new Date();
  }
}
