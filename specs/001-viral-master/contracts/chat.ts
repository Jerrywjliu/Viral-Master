// AI Chat Contracts

interface AgentInfo {
  id: string
  name: string
  avatar: string
  description: string
  greeting: string
  presetQuestions: string[]
  capabilityCards: CapabilityCard[]
}

interface CapabilityCard {
  id: string
  name: string
  thumbnail: string
  route: string
}

interface ChatSession {
  id: string
  agentId: string
  title?: string
  createdAt: string
  updatedAt: string
}

interface ChatMessage {
  id: string
  sessionId: string
  role: 'user' | 'ai'
  content: string
  annotations?: Annotation[]
  references?: string[]
  createdAt: string
}

interface Annotation {
  id: string
  text: string
  createdAt: string
}

interface SendMessageRequest {
  sessionId?: string    // null = new session
  content: string
  webSearch: boolean
  knowledgeBase: boolean
}

// SSE event types for chat streaming
interface ChatStreamEvent {
  type: 'token' | 'done' | 'error'
  data: string          // token text, or error message
  sessionId?: string    // included on first token and done
}

interface ChatSessionListResponse {
  recent7Days: ChatSession[]
  recent30Days: ChatSession[]
  older: ChatSession[]
}

// APIs
// GET  /api/v1/viral-master/chat/agent        → AgentInfo
// POST /api/v1/viral-master/chat/sessions     → { sessionId: string }
// GET  /api/v1/viral-master/chat/sessions      → ChatSessionListResponse
// GET  /api/v1/viral-master/chat/sessions/:id  → ChatMessage[]
// GET  /api/v1/viral-master/chat/stream?sessionId=&content=&webSearch=&knowledgeBase=
//      → SSE stream of ChatStreamEvent
// POST /api/v1/viral-master/chat/messages/:id/annotations → Annotation
// POST /api/v1/viral-master/chat/sessions/:id/export → Binary (Word doc)
// POST /api/v1/viral-master/chat/sessions/:id/share → { shareUrl: string }
