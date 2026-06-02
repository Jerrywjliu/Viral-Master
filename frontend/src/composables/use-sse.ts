import { ref, onUnmounted } from 'vue'
import type { SSEEvent } from '@/types'

export function useSSE(url: string) {
  const eventSource = ref<EventSource | null>(null)
  const isConnected = ref(false)
  const lastEvent = ref<SSEEvent | null>(null)
  const error = ref<string | null>(null)

  let reconnectTimer: ReturnType<typeof setTimeout> | null = null
  let reconnectAttempts = 0
  const maxReconnectAttempts = 5
  const reconnectDelay = 3000

  function connect(token?: string) {
    if (eventSource.value) {
      disconnect()
    }

    try {
      const fullUrl = token ? `${url}?token=${token}` : url
      eventSource.value = new EventSource(fullUrl)

      eventSource.value.onopen = () => {
        isConnected.value = true
        error.value = null
        reconnectAttempts = 0
      }

      eventSource.value.onmessage = (event) => {
        try {
          const parsed: SSEEvent = JSON.parse(event.data)
          lastEvent.value = parsed
        } catch {
          // If not JSON, treat as message type
          lastEvent.value = {
            type: 'message',
            data: event.data,
          }
        }
      }

      eventSource.value.addEventListener('progress', (event: MessageEvent) => {
        lastEvent.value = {
          type: 'progress',
          data: event.data,
        }
      })

      eventSource.value.addEventListener('complete', (event: MessageEvent) => {
        lastEvent.value = {
          type: 'complete',
          data: event.data,
        }
      })

      eventSource.value.addEventListener('error', (event: MessageEvent) => {
        lastEvent.value = {
          type: 'error',
          data: event.data,
        }
      })

      eventSource.value.onerror = () => {
        isConnected.value = false
        error.value = 'SSE 连接断开'

        if (reconnectAttempts < maxReconnectAttempts) {
          reconnectAttempts++
          reconnectTimer = setTimeout(() => {
            connect(token)
          }, reconnectDelay)
        }
      }
    } catch (err) {
      error.value = `SSE 连接失败: ${err}`
      isConnected.value = false
    }
  }

  function disconnect() {
    if (eventSource.value) {
      eventSource.value.close()
      eventSource.value = null
    }
    isConnected.value = false
    if (reconnectTimer) {
      clearTimeout(reconnectTimer)
      reconnectTimer = null
    }
  }

  function onEvent(callback: (event: SSEEvent) => void) {
    const unwatch = () => {
      // Would need a watcher in a component context
    }
    // Simple poll-based approach: expose the last event
    // The consumer can watch `lastEvent` ref
    return unwatch
  }

  onUnmounted(() => {
    disconnect()
  })

  return {
    isConnected,
    lastEvent,
    error,
    connect,
    disconnect,
    onEvent,
  }
}
