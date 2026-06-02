import { Injectable, Logger } from '@nestjs/common';
import { Subject, Observable, filter } from 'rxjs';
import { map } from 'rxjs/operators';

export interface SseMessageEvent {
  id?: string;
  type?: string;
  data: string;
  retry?: number;
}

@Injectable()
export class SseStreamService {
  private readonly logger = new Logger(SseStreamService.name);
  private eventSubject = new Subject<SseMessageEvent>();
  private activeConnections = 0;

  /**
   * Create an observable stream for SSE connections.
   * Tracks active connections and performs cleanup on abort.
   */
  createStream(eventFilter?: string): Observable<MessageEvent> {
    this.activeConnections++;
    this.logger.log(`SSE connection opened. Active connections: ${this.activeConnections}`);

    let source$ = this.eventSubject.asObservable();

    // Apply event type filter if specified
    if (eventFilter) {
      source$ = source$.pipe(
        filter((event) => event.type === eventFilter || !event.type),
      );
    }

    return source$.pipe(
      map((event) => {
        const messageEvent = new MessageEvent(event.type || 'message', {
          data: event.data,
        });
        // Assign id and retry via type extension
        Object.defineProperty(messageEvent, 'id', {
          value: event.id,
          writable: false,
        });
        Object.defineProperty(messageEvent, 'retry', {
          value: event.retry,
          writable: false,
        });
        return messageEvent;
      }),
    );
  }

  /**
   * Send an event to all connected SSE clients.
   */
  sendEvent(event: SseMessageEvent): void {
    this.eventSubject.next(event);
  }

  /**
   * Send a data event with optional type.
   */
  send(data: string, type?: string, id?: string): void {
    this.eventSubject.next({ data, type, id });
  }

  /**
   * Complete the stream and clean up all connections.
   */
  complete(): void {
    this.eventSubject.complete();
    this.activeConnections = 0;
    this.logger.log('SSE stream completed. All connections cleaned up.');
  }

  /**
   * Decrement the active connection counter.
   * Call this when a client disconnects.
   */
  onConnectionClosed(): void {
    this.activeConnections = Math.max(0, this.activeConnections - 1);
    this.logger.log(`SSE connection closed. Active connections: ${this.activeConnections}`);
  }

  /**
   * Check if there are active observers.
   */
  hasObservers(): boolean {
    return this.activeConnections > 0;
  }

  /**
   * Get the number of active connections.
   */
  getActiveConnectionCount(): number {
    return this.activeConnections;
  }
}
