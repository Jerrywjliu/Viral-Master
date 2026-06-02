/**
 * Chat message role types.
 */
export enum ChatMessageRole {
  SYSTEM = 'system',
  USER = 'user',
  ASSISTANT = 'assistant',
  FUNCTION = 'function',
}

/**
 * A single chat message in a conversation.
 */
export interface ChatMessage {
  role: ChatMessageRole;
  content: string;
  name?: string;
}

/**
 * Parameters for sending a chat completion request.
 */
export interface ChatCompletionParams {
  /**
   * The conversation messages.
   */
  messages: ChatMessage[];

  /**
   * ID of the model to use.
   */
  model?: string;

  /**
   * Temperature for response randomness (0-2).
   */
  temperature?: number;

  /**
   * Maximum tokens in the response.
   */
  maxTokens?: number;

  /**
   * Top-p sampling parameter.
   */
  topP?: number;

  /**
   * Whether to stream the response.
   */
  stream?: boolean;

  /**
   * Additional provider-specific parameters.
   */
  [key: string]: any;
}

/**
 * Chunk of a streaming chat response.
 */
export interface ChatStreamChunk {
  content: string;
  done: boolean;
  finishReason?: string;
}

/**
 * Complete (non-streaming) chat completion response.
 */
export interface ChatCompletionResult {
  content: string;
  model: string;
  usage?: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
  finishReason?: string;
}

/**
 * Callback type for streaming token reception.
 */
export type OnTokenCallback = (chunk: ChatStreamChunk) => void | Promise<void>;

/**
 * Interface for chat/AI providers.
 */
export interface IChatProvider {
  /**
   * Send a chat completion request with support for streaming via callback.
   * If onToken is provided, the response is streamed chunk by chunk.
   * Returns the full completion result.
   */
  sendMessage(
    params: ChatCompletionParams,
    onToken?: OnTokenCallback,
  ): Promise<ChatCompletionResult>;

  /**
   * Get the list of available models for this provider.
   */
  getAvailableModels(): Promise<string[]>;

  /**
   * Get the provider name identifier.
   */
  getProviderName(): string;
}
