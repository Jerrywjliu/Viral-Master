import { Injectable, Logger, Sse } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable } from 'rxjs';
import { SseStreamService } from '../../common/sse/sse-stream.service';

@Injectable()
export class ChatSseHandler {
  private readonly logger = new Logger(ChatSseHandler.name);

  constructor(private readonly sseStreamService: SseStreamService) {}

  /**
   * Handle SSE connection for chat events.
   * Clients connect to this endpoint to receive real-time chat updates.
   */
  @Sse()
  handleConnection(req: Request, res: Response): Observable<MessageEvent> {
    this.logger.log('New SSE connection established for chat events');

    // Set SSE headers manually for better control
    res.setHeader('Content-Type', 'text/event-stream');
    res.setHeader('Cache-Control', 'no-cache');
    res.setHeader('Connection', 'keep-alive');
    res.setHeader('X-Accel-Buffering', 'no');

    // Handle client disconnect
    req.on('close', () => {
      this.sseStreamService.onConnectionClosed();
      this.logger.log('SSE connection closed by client');
    });

    return this.sseStreamService.createStream();
  }

  /**
   * Send a chat event to all connected SSE clients.
   */
  sendChatEvent(
    type: string,
    data: any,
    eventId?: string,
  ): void {
    this.sseStreamService.send(
      JSON.stringify(data),
      type,
      eventId,
    );
  }

  /**
   * Send a token event (for streaming AI responses).
   */
  sendToken(sessionId: string, messageId: string, content: string, index: number): void {
    this.sendChatEvent('token', {
      type: 'token',
      content,
      sessionId,
      messageId,
    }, `${messageId}-${index}`);
  }

  /**
   * Send a completion event when streaming is done.
   */
  sendDone(sessionId: string, messageId: string, fullContent: string): void {
    this.sendChatEvent('done', {
      type: 'done',
      messageId,
      sessionId,
      content: fullContent,
    }, messageId);
  }

  /**
   * Send an error event.
   */
  sendError(sessionId: string, errorMessage: string): void {
    this.sendChatEvent('error', {
      type: 'error',
      sessionId,
      message: errorMessage,
    });
  }
}
