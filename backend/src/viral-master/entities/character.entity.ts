import { v4 as uuidv4 } from 'uuid';

export enum CharacterStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DRAFT = 'draft',
}

export class Character {
  id: string;
  name: string;
  avatarUrl?: string;
  description?: string;
  personality?: string;
  voiceConfig?: Record<string, any>;
  appearanceConfig?: Record<string, any>;
  backgroundStory?: string;
  status: CharacterStatus;
  metadata?: Record<string, any>;
  createdAt: Date;
  updatedAt: Date;

  constructor(partial: Partial<Character>) {
    this.id = partial.id || uuidv4();
    this.name = partial.name || '';
    this.avatarUrl = partial.avatarUrl;
    this.description = partial.description;
    this.personality = partial.personality;
    this.voiceConfig = partial.voiceConfig || {};
    this.appearanceConfig = partial.appearanceConfig || {};
    this.backgroundStory = partial.backgroundStory;
    this.status = partial.status || CharacterStatus.DRAFT;
    this.metadata = partial.metadata || {};
    this.createdAt = partial.createdAt || new Date();
    this.updatedAt = partial.updatedAt || new Date();
  }
}
