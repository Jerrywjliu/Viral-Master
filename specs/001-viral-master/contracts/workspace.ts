// Workspace Directory Tree Contracts

type PermissionLevel = 'personal' | 'department' | 'enterprise'

interface WorkspaceNode {
  id: string
  parentId?: string
  name: string
  type: 'dir' | 'file'
  children?: WorkspaceNode[]
  permission: PermissionLevel
  refId?: string      // FK to VideoTask if type=file
  createdAt: string
}

interface WorkspaceTreeResponse {
  roots: WorkspaceNode[]    // top-level nodes (personal, department, enterprise)
}

interface CreateDirRequest {
  parentId?: string
  name: string
  permission: PermissionLevel
}

// APIs
// GET  /api/v1/viral-master/workspace/tree     → WorkspaceTreeResponse
// POST /api/v1/viral-master/workspace/dirs     → WorkspaceNode (create dir)
// DELETE /api/v1/viral-master/workspace/dirs/:id → void
// PUT  /api/v1/viral-master/workspace/dirs/:id → WorkspaceNode (rename)
