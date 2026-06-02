import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { Character, CharacterStatus } from '../entities/character.entity';

@Injectable()
export class CharacterService {
  private readonly logger = new Logger(CharacterService.name);
  private characters: Map<string, Character> = new Map();

  async create(partial: Partial<Character>): Promise<Character> {
    const character = new Character(partial);
    this.characters.set(character.id, character);
    this.logger.log(`Character created: ${character.id} - "${character.name}"`);
    return character;
  }

  async findById(id: string): Promise<Character> {
    const character = this.characters.get(id);
    if (!character) {
      throw new NotFoundException(`Character ${id} not found`);
    }
    return character;
  }

  async findAll(filter?: { status?: CharacterStatus }): Promise<Character[]> {
    let results = Array.from(this.characters.values());
    if (filter?.status) {
      results = results.filter((c) => c.status === filter.status);
    }
    return results.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  async update(id: string, updates: Partial<Character>): Promise<Character> {
    const character = await this.findById(id);
    Object.assign(character, { ...updates, updatedAt: new Date() });
    this.characters.set(id, character);
    return character;
  }

  async delete(id: string): Promise<void> {
    await this.findById(id);
    this.characters.delete(id);
    this.logger.log(`Character deleted: ${id}`);
  }
}
