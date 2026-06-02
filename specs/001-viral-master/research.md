# Research: 爆款大师模块

## 1. Seedance 2.0 API Integration

### Authentication
- Bearer Token: `Authorization: Bearer <ARK_API_KEY>`
- API Key 在火山引擎控制台 → 方舟 → API Key 页面生成

### Endpoints
| 用途 | Method | Path |
|------|--------|------|
| 创建视频任务 | POST | `/api/v3/contents/generations/tasks` |
| 查询任务状态 | GET | `/api/v3/contents/generations/tasks/{task_id}` |
| 任务列表 | GET | `/api/v3/contents/generations/tasks` |
| 取消任务 | DELETE | `/api/v3/contents/generations/tasks/{task_id}` |

### Async Task Flow
1. POST 提交 → 返回 `task_id`（HTTP 202）
2. 轮询 GET `{task_id}` → `status`: `queued` → `running` → `succeeded`/`failed`
3. 支持 `callback_url` 参数（Webhook 回调，比轮询更高效）
4. 完成后 `content.video_url` 获取视频，有效期 24 小时

### Model Versions
- `doubao-seedance-2-0-260128`（标准版）
- `doubao-seedance-2-0-fast-260128`（快速版）

### Parameters
- Duration: 4-15s | Resolution: 480p~2K
- Aspect ratios: 16:9, 9:16, 4:3, 3:4, 21:9, 1:1, adaptive
- Max 12 files per request, images ≤9 (each <30MB), videos ≤3 (each <50MB, 2-15s)

### Pricing
- 1080p: ~$0.93/5s video, ~$1.32/10s, ~$1.97/15s
- Concurrency limit: ~10 tasks (configurable)

## 2. International Video Engine Comparison

### Top Recommendation: Kling 3.0 (快手国际版)
- **Chinese company, zero network barrier** - direct API access
- Best value: ~$0.075/s, up to 3min video, 1080p/60fps
- Mature async API + webhook + SDK (Python, Node.js)
- Supports native audio (v3.0 Omni)

### Backup: Seedance 2.0 (ByteDance)
- Same company ecosystem, direct access
- Multi-modal reference support (image/video/audio)
- Slightly slower generation (~45s+)

### Not Recommended
- Sora 2: China IP blocked, API shutting down Sep 2026
- Runway Gen-4.5: China needs proxy, highest price
- Pika 2.2: China needs proxy, silent video, lower quality

### Architecture
```
[API Gateway] → [Unified Task Service]
                   ↙           ↘
          [Kling API]    [Seedance API]
          (primary)      (backup/special)
                   ↘           ↙
                [Webhook Callback]
                      ↓
            [CDN → Return to User]
```

## 3. SSE Streaming Pattern

### Backend (NestJS)
- Use `@Sse()` decorator with RxJS `Subject` or `Observable`
- Controller method returns `Observable<MessageEvent>`
- Handle abort: `@Req() req: Request` → `req.on('close', () => subject.complete())`

### Frontend (Vue 3)
- Use `EventSource` API for simple SSE (GET only, no custom headers)
- Use fetch-based SSE client if Bearer token needed (Axios + ReadableStream)
- Handle: connection retry (exponential backoff: 1s → 2s → 4s → max 30s), partial message buffering, stream termination
- Cleanup: `onUnmounted()` → close connection
- Store streaming message text in Pinia, append chunks as received

## 4. File Upload Strategy

### Requirements
- Max file: 500MB per file
- Max 12 files per request
- Types: image (jpg/png/webp/bmp/tiff/gif), video (mp4/mov), audio (mp3/wav)
- 10GB total per user

### Chunked Upload with Resume
- Frontend: slice file into 5MB chunks using `File.slice()`
- Upload each chunk via multipart form
- Backend: track chunks by file hash, reassemble on completion
- Resume: query uploaded chunks on reconnect, skip completed ones
- Parallel upload: 3-5 concurrent chunks per file

### Implementation
- NestJS: `@nestjs/platform-express` + custom file interceptor
- MinIO: `putObject` with multipart upload support
- Progress: emit SSE events for upload progress

## 5. Testing Approach

### Frontend (Vue 3 + Naive UI)
- Framework: **Vitest** + **@vue/test-utils**
- Component tests for chat, video creation, card area
- Store tests for Pinia (credit balance, task polling)
- API mock: MSW (Mock Service Worker) or Vitest mock functions

### Backend (NestJS)
- Framework: **Jest** (built-in with NestJS)
- Unit tests: service logic (credit calculation, task validation)
- Integration tests: controller → service → mocked provider
- E2E tests: supertest for API endpoints

### Test Coverage Targets
- Core business logic (credit, task submission): >90%
- UI components: >70%
- Integration: critical paths covered
