// Material Management Contracts

type MaterialType = 'image' | 'video' | 'audio'
type MaterialStatus = 'normal' | 'processing' | 'failed'

interface Material {
  id: string
  name: string
  type: MaterialType
  mimeType: string
  size: number
  url: string
  thumbnailUrl?: string
  status: MaterialStatus
  isPublic: boolean
  createdAt: string
}

interface MaterialListRequest {
  page: number
  pageSize: number
  type?: MaterialType
}

interface MaterialListResponse {
  items: Material[]
  total: number
  page: number
  pageSize: number
}

interface RecentMaterial {
  id: string
  name: string
  type: MaterialType
  promptText: string   // auto-filled prompt text
}

// Chunked upload contract
interface UploadChunkRequest {
  fileId: string      // client-generated unique file ID
  fileName: string
  chunkIndex: number
  totalChunks: number
  chunkData: Blob
  fileHash: string    // MD5 of full file (for integrity check)
}

interface UploadChunkResponse {
  fileId: string
  chunkIndex: number
  received: boolean
}

interface UploadCompleteRequest {
  fileId: string
  totalChunks: number
  fileHash: string
}

interface UploadCompleteResponse {
  materialId: string
  url: string
}

// APIs
// POST /api/v1/viral-master/materials/upload/chunk    → UploadChunkResponse
// POST /api/v1/viral-master/materials/upload/complete → UploadCompleteResponse
// GET  /api/v1/viral-master/materials                 → MaterialListResponse
// GET  /api/v1/viral-master/materials/recent          → RecentMaterial[]
// DELETE /api/v1/viral-master/materials/:id           → void
