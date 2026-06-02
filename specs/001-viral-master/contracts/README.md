# API Contracts: 爆款大师模块

Contracts define the shared TypeScript interfaces between Vue 3 frontend and NestJS backend.

## Contract Files

| File | Scope |
|------|-------|
| `chat.ts` | AI Chat SSE streaming, session management |
| `video.ts` | Video task submission, status polling, results |
| `credit.ts` | Credit balance query, cost calculation |
| `material.ts` | Material upload, list, management |
| `workspace.ts` | Workspace directory tree |
| `common.ts` | Shared types, pagination, response wrappers |

## API Conventions

- **Base URL**: `/api/v1/viral-master`
- **Auth**: Bearer JWT token in `Authorization` header
- **Response format**: `{ code: number, data: T, message: string }`
- **Pagination**: `{ items: T[], total: number, page: number, pageSize: number }`
- **SSE endpoint**: `/api/v1/viral-master/chat/stream` (GET, with sessionId query param)
