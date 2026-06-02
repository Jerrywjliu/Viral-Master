import { Injectable, Logger, NotFoundException } from '@nestjs/common';
import { ChatSession, ChatSessionStatus } from '../entities/chat-session.entity';
import { ChatMessage, MessageRole, MessageType } from '../entities/chat-message.entity';
import { SseStreamService } from '../../common/sse/sse-stream.service';

@Injectable()
export class ChatService {
  private readonly logger = new Logger(ChatService.name);

  // In-memory storage (to be replaced with database in production)
  private sessions: Map<string, ChatSession> = new Map();
  private messages: Map<string, ChatMessage[]> = new Map();

  constructor(private readonly sseStreamService: SseStreamService) {}

  // ============ Session Management ============

  async createSession(partial: Partial<ChatSession>): Promise<ChatSession> {
    const session = new ChatSession(partial);
    this.sessions.set(session.id, session);
    this.messages.set(session.id, []);
    this.logger.log(`Chat session created: ${session.id} - "${session.title}"`);
    return session;
  }

  async getSession(sessionId: string): Promise<ChatSession> {
    const session = this.sessions.get(sessionId);
    if (!session) {
      throw new NotFoundException(`Chat session ${sessionId} not found`);
    }
    return session;
  }

  async updateSession(sessionId: string, updates: Partial<ChatSession>): Promise<ChatSession> {
    const session = await this.getSession(sessionId);
    Object.assign(session, { ...updates, updatedAt: new Date() });
    this.sessions.set(sessionId, session);
    return session;
  }

  async deleteSession(sessionId: string): Promise<void> {
    if (!this.sessions.has(sessionId)) {
      throw new NotFoundException(`Chat session ${sessionId} not found`);
    }
    this.sessions.delete(sessionId);
    this.messages.delete(sessionId);
    this.logger.log(`Chat session deleted: ${sessionId}`);
  }

  async listSessions(filter?: {
    agentId?: string;
    characterId?: string;
    status?: ChatSessionStatus;
  }): Promise<ChatSession[]> {
    let sessions = Array.from(this.sessions.values());

    if (filter) {
      if (filter.agentId) {
        sessions = sessions.filter((s) => s.agentId === filter.agentId);
      }
      if (filter.characterId) {
        sessions = sessions.filter((s) => s.characterId === filter.characterId);
      }
      if (filter.status) {
        sessions = sessions.filter((s) => s.status === filter.status);
      }
    }

    return sessions.sort((a, b) => b.updatedAt.getTime() - a.updatedAt.getTime());
  }

  // ============ Message Management ============

  async addMessage(sessionId: string, partial: Partial<ChatMessage>): Promise<ChatMessage> {
    const session = await this.getSession(sessionId);
    
    const message = new ChatMessage({
      ...partial,
      sessionId,
    });

    const sessionMessages = this.messages.get(sessionId) || [];
    sessionMessages.push(message);
    this.messages.set(sessionId, sessionMessages);

    // Update session's updatedAt
    session.updatedAt = new Date();
    this.sessions.set(sessionId, session);

    return message;
  }

  async getMessages(sessionId: string): Promise<ChatMessage[]> {
    await this.getSession(sessionId); // Ensure session exists
    return this.messages.get(sessionId) || [];
  }

  async deleteMessage(sessionId: string, messageId: string): Promise<void> {
    await this.getSession(sessionId);
    const sessionMessages = this.messages.get(sessionId) || [];
    const index = sessionMessages.findIndex((m) => m.id === messageId);
    if (index === -1) {
      throw new NotFoundException(`Message ${messageId} not found in session ${sessionId}`);
    }
    sessionMessages.splice(index, 1);
    this.messages.set(sessionId, sessionMessages);
  }

  // ============ SSE Orchestration ============

  /**
   * Process a chat message and stream the AI response via SSE.
   */
  async processMessageWithStreaming(
    sessionId: string,
    userMessage: string,
    agentId?: string,
  ): Promise<ChatMessage> {
    // Save user message
    const userMsg = await this.addMessage(sessionId, {
      role: MessageRole.USER,
      type: MessageType.TEXT,
      content: userMessage,
    });

    // Create a placeholder assistant message
    const assistantMsg = await this.addMessage(sessionId, {
      role: MessageRole.ASSISTANT,
      type: MessageType.TEXT,
      content: '',
    });

    // Send session events via SSE
    this.sseStreamService.send(
      JSON.stringify({
        type: 'session',
        sessionId,
      }),
      'session',
      sessionId,
    );

    // Send user message event
    this.sseStreamService.send(
      JSON.stringify({
        type: 'message',
        message: userMsg,
      }),
      'message',
      userMsg.id,
    );

    // For now, simulate an AI response with streaming
    // In production, this would call an AI provider
    const simulationResponse = `This is a simulated response to: "${userMessage}". Replace with actual AI provider integration.`;
    const words = simulationResponse.split(' ');

    for (let i = 0; i < words.length; i++) {
      const chunk = words[i] + (i < words.length - 1 ? ' ' : '');
      assistantMsg.content += chunk;

      // Send token event
      this.sseStreamService.send(
        JSON.stringify({
          type: 'token',
          content: chunk,
          sessionId,
          messageId: assistantMsg.id,
        }),
        'token',
        `${assistantMsg.id}-${i}`,
      );

      // Simulate delay for streaming effect
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // Send done event
    this.sseStreamService.send(
      JSON.stringify({
        type: 'done',
        messageId: assistantMsg.id,
        sessionId,
        content: assistantMsg.content,
      }),
      'done',
      assistantMsg.id,
    );

    // Update the message with the full content
    await this.updateMessage(sessionId, assistantMsg.id, {
      content: assistantMsg.content,
    });

    return assistantMsg;
  }

  private async updateMessage(
    sessionId: string,
    messageId: string,
    updates: Partial<ChatMessage>,
  ): Promise<ChatMessage> {
    const sessionMessages = this.messages.get(sessionId) || [];
    const message = sessionMessages.find((m) => m.id === messageId);
    if (!message) {
      throw new NotFoundException(`Message ${messageId} not found`);
    }
    Object.assign(message, updates);
    return message;
  }
}
