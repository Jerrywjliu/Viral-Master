// ==================== Chat Types ====================

export interface ChatMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: number
  annotations?: MessageAnnotation[]
  status?: 'sending' | 'sent' | 'error'
}

export interface MessageAnnotation {
  id: string
  type: 'link' | 'image' | 'video' | 'file'
  label: string
  url?: string
  thumbnail?: string
}

export interface PresetQuestion {
  id: string
  text: string
  icon?: string
}

export interface CapabilityCard {
  id: string
  name: string
  description: string
  thumbnail: string
  route: string
}

export interface SessionGroup {
  title: string
  sessions: Session[]
}

export interface Session {
  id: string
  title: string
  lastTime: string
  timestamp: number
}

// ==================== Video Types ====================

export type VideoMode = 'native' | 'long' | 'enhanced' | 'character'

export type VideoRatio = '9:16' | '3:4' | '1:1' | '16:9'

export type TaskStatus = 'queued' | 'processing' | 'completed' | 'failed'

export interface VideoTask {
  id: string
  title: string
  status: TaskStatus
  progress: number
  createdAt: string
  mode: VideoMode
  materialCount: number
  output?: VideoOutput[]
}

export interface VideoOutput {
  id: string
  url: string
  thumbnail: string
  title: string
  duration: number
  size: number
}

export interface VideoParams {
  version: string
  model: string
  ratio: VideoRatio
  quantity: number
}

export interface Material {
  id: string
  name: string
  type: 'video' | 'image' | 'audio'
  url: string
  thumbnail: string
  size: number
  duration?: number
  createdAt: string
}

export interface CreativeDescription {
  content: string
  referencedMaterials: string[]
}

export interface Character {
  id: string
  name: string
  avatar: string
  description: string
  createdAt: string
}

// ==================== Credit Types ====================

export interface CreditInfo {
  balance: number
  totalUsed: number
  totalRecharged: number
  tasks: CreditTask[]
}

export interface CreditTask {
  id: string
  type: string
  amount: number
  description: string
  timestamp: number
}

// ==================== Knowledge Types ====================

export interface KnowledgeBase {
  id: string
  name: string
  description: string
  documentCount: number
}

export interface DepartmentNode {
  id: string
  name: string
  icon?: string
  children?: DepartmentNode[]
  route?: string
}

// ==================== API Response Types ====================

export interface ApiResponse<T = unknown> {
  code: number
  message: string
  data: T
}

export interface PaginatedData<T> {
  list: T[]
  total: number
  page: number
  pageSize: number
}

export interface SSEEvent {
  type: 'message' | 'progress' | 'complete' | 'error'
  data: unknown
}
