# Quickstart: 爆款大师模块

## Prerequisites

- Node.js 18+
- NestJS CLI (`npm i -g @nestjs/cli`)
- MinIO or Alibaba OSS access (configured credentials)
- Seedance 2.0 API Key (火山引擎方舟平台)
- (Optional) Kling API Key for international version

## Setup

```bash
# Backend
cd backend
npm install
cp .env.example .env    # Configure API keys, DB, OSS
npm run start:dev       # http://localhost:3000

# Frontend
cd frontend
npm install
cp .env.example .env    # Configure API base URL
npm run dev             # http://localhost:5173
```

## Project Structure (within feature)

```
backend/src/viral-master/
├── dto/                    # Request/response DTOs
├── interfaces/             # AI service abstraction (IVideoProvider, IChatProvider)
├── providers/              # Engine implementations (SeedanceProvider, KlingProvider)
├── services/               # Business logic (ChatService, VideoService, CreditService)
├── controllers/            # REST endpoints
└── sse/                    # SSE streaming handler

frontend/src/
├── views/viral-master/     # Chat page
├── views/video-creation/   # Domestic + International video creation
├── components/chat/        # Chat components
├── components/video/       # Video creation components
├── components/common/      # Right panel, nav tree
├── stores/                 # Pinia stores (chat, video, credit)
├── api/                    # API service layer
└── types/                  # Shared TypeScript interfaces
```

## Key Environment Variables

```env
# Backend
SEEDANCE_API_KEY=your_key
SEEDANCE_BASE_URL=https://ark.cn-beijing.volces.com/api/v3
MINIO_ENDPOINT=localhost:9000
MINIO_ACCESS_KEY=your_key
MINIO_SECRET_KEY=your_secret
OSS_BUCKET=viral-master

# Frontend
VITE_API_BASE_URL=http://localhost:3000/api/v1
```

## Running Tests

```bash
# Backend
cd backend
npm run test           # Unit tests
npm run test:e2e       # E2E tests

# Frontend
cd frontend
npm run test:unit      # Vitest unit tests
```

## Phase Delivery Order

| Phase | Stories | Scope |
|-------|---------|-------|
| P1 (MVP) | US1, US2, US3 | Chat, Domestic video creation, Credit system |
| P2 | US4, US5 | International version, Content management |
| P3 | US6 | AI polish, Long video, Export/Share |
