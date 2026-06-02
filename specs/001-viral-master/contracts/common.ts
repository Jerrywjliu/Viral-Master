// Shared Types

interface ApiResponse<T> {
  code: number
  data: T
  message: string
}

interface PaginatedResponse<T> {
  items: T[]
  total: number
  page: number
  pageSize: number
}

interface PaginatedRequest {
  page?: number
  pageSize?: number
}

// SSE connection options
interface SSEClientOptions {
  url: string
  method?: 'GET' | 'POST'
  headers?: Record<string, string>
  body?: string
  onMessage: (event: SSEEvent) => void
  onError?: (error: Error) => void
  retryOptions?: {
    initialDelay: number    // ms
    maxDelay: number        // ms
    maxRetries: number
  }
}

interface SSEEvent {
  type: string
  data: string
  id?: string
}
