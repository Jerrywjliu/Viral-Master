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
import { CharacterService } from '../services/character.service';
import { Character, CharacterStatus } from '../entities/character.entity';
import { ApiResponse } from '../../common/dto/api-response';

@Controller('characters')
export class CharacterController {
  constructor(private readonly characterService: CharacterService) {}

  @Post()
  async create(@Body() body: Partial<Character>): Promise<ApiResponse<Character>> {
    const character = await this.characterService.create(body);
    return ApiResponse.created(character, 'Character created');
  }

  @Get()
  async findAll(
    @Query('status') status?: CharacterStatus,
  ): Promise<ApiResponse<Character[]>> {
    const characters = await this.characterService.findAll({ status });
    return ApiResponse.success(characters);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ApiResponse<Character>> {
    const character = await this.characterService.findById(id);
    return ApiResponse.success(character);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() body: Partial<Character>,
  ): Promise<ApiResponse<Character>> {
    const character = await this.characterService.update(id, body);
    return ApiResponse.success(character, 'Character updated');
  }

  @Delete(':id')
  async delete(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.characterService.delete(id);
    return ApiResponse.success(null as any, 'Character deleted');
  }
}
