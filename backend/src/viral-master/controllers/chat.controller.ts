import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Query,
  Req,
} from '@nestjs/common';
import { ChatService } from '../services/chat.service';
import { ChatSession, ChatSessionStatus } from '../entities/chat-session.entity';
import { ChatMessage } from '../entities/chat-message.entity';
import { ApiResponse, PaginatedResponse } from '../../common/dto/api-response';

@Controller('chat')
export class ChatController {
  constructor(private readonly chatService: ChatService) {}

  // ============ Session Endpoints ============

  @Post('sessions')
  async createSession(
    @Body() body: Partial<ChatSession>,
  ): Promise<ApiResponse<ChatSession>> {
    const session = await this.chatService.createSession(body);
    return ApiResponse.created(session, 'Chat session created');
  }

  @Get('sessions')
  async listSessions(
    @Query('agentId') agentId?: string,
    @Query('characterId') characterId?: string,
    @Query('status') status?: ChatSessionStatus,
  ): Promise<ApiResponse<ChatSession[]>> {
    const sessions = await this.chatService.listSessions({
      agentId,
      characterId,
      status,
    });
    return ApiResponse.success(sessions);
  }

  @Get('sessions/:id')
  async getSession(@Param('id') id: string): Promise<ApiResponse<ChatSession>> {
    const session = await this.chatService.getSession(id);
    return ApiResponse.success(session);
  }

  @Patch('sessions/:id')
  async updateSession(
    @Param('id') id: string,
    @Body() body: Partial<ChatSession>,
  ): Promise<ApiResponse<ChatSession>> {
    const session = await this.chatService.updateSession(id, body);
    return ApiResponse.success(session, 'Session updated');
  }

  @Delete('sessions/:id')
  async deleteSession(@Param('id') id: string): Promise<ApiResponse<void>> {
    await this.chatService.deleteSession(id);
    return ApiResponse.success(null as any, 'Session deleted');
  }

  // ============ Message Endpoints ============

  @Post('sessions/:sessionId/messages')
  async sendMessage(
    @Param('sessionId') sessionId: string,
    @Body() body: { content: string; agentId?: string },
  ): Promise<ApiResponse<ChatMessage>> {
    const message = await this.chatService.processMessageWithStreaming(
      sessionId,
      body.content,
      body.agentId,
    );
    return ApiResponse.success(message);
  }

  @Get('sessions/:sessionId/messages')
  async getMessages(
    @Param('sessionId') sessionId: string,
  ): Promise<ApiResponse<ChatMessage[]>> {
    const messages = await this.chatService.getMessages(sessionId);
    return ApiResponse.success(messages);
  }

  @Delete('sessions/:sessionId/messages/:messageId')
  async deleteMessage(
    @Param('sessionId') sessionId: string,
    @Param('messageId') messageId: string,
  ): Promise<ApiResponse<void>> {
    await this.chatService.deleteMessage(sessionId, messageId);
    return ApiResponse.success(null as any, 'Message deleted');
  }
}
