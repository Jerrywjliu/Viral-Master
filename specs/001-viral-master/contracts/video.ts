// Video Creation Contracts

type VideoEngine = 'seedance' | 'kling' | 'wan'
type VideoMode = 'domestic' | 'international'
type VideoSubMode = 'native' | 'long-video'
type InternationalSubMode = 'native' | 'enhanced' | 'create-character'
type TaskStatus = 'queued' | 'running' | 'succeeded' | 'failed'

interface VideoCreateRequest {
  mode: VideoMode
  subMode: string
  creativeDescription: string
  materialIds: string[]
  modelVersion: string
  resolution: '480p' | '720p' | '1080p' | '2K'
  aspectRatio: '9:16' | '3:4' | '1:1' | '16:9' | '4:3' | '21:9'
  duration: number           // seconds, 4-15
  quantity: 1 | 3 | 5
}

interface VideoCreateResponse {
  taskId: string
  creditCost: number
  estimatedWaitTime: number  // seconds
}

interface VideoTask {
  id: string
  engine: VideoEngine
  mode: VideoMode
  subMode: string
  status: TaskStatus
  progress: number           // 0-100
  creativeDescription: string
  modelVersion: string
  aspectRatio: string
  duration: number
  quantity: number
  creditCost: number
  outputs: VideoOutput[]
  errorMessage?: string
  createdAt: string
  completedAt?: string
}

interface VideoOutput {
  id: string
  url: string
  thumbnailUrl?: string
  duration: number
}

interface VideoTaskListRequest {
  page: number
  pageSize: number
  status?: TaskStatus
}

interface VideoTaskListResponse {
  items: VideoTask[]
  total: number
  page: number
  pageSize: number
}

// APIs
// POST /api/v1/viral-master/video/tasks         → VideoCreateResponse (create + submit)
// GET  /api/v1/viral-master/video/tasks          → VideoTaskListResponse (my tasks)
// GET  /api/v1/viral-master/video/tasks/:id     → VideoTask (single task status)
// POST /api/v1/viral-master/video/tasks/:id/cancel → void
// GET  /api/v1/viral-master/video/works         → VideoTaskListResponse (completed works)
// POST /api/v1/viral-master/video/works/:id/remake → VideoCreateResponse (generate similar)
