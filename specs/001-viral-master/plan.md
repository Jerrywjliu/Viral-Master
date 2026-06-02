# Implementation Plan: 爆款大师模块

**Branch**: `001-viral-master` | **Date**: 2026-06-01 | **Spec**: `specs/001-viral-master/spec.md`

**Input**: Feature specification from `specs/001-viral-master/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command.

## Summary

爆款大师模块是 DynaXAI 平台的生产部门核心模块，包含三个子模块：一键追爆（AI 对话）、一键大片国内版、一键大片国际版，以及算力计费、内容管理等通用支撑功能。采用 Vue 3 + Naive UI 前端 + NestJS 后端架构，国内视频引擎对接 Seedance 2.0（火山引擎），国际引擎待定（预留抽象层）。AI 对话 SSE 流式输出，任务状态通过客户端轮询获取。分三阶段交付（MVP → 增强 → 高级功能）。

## Technical Context

**Language/Version**: TypeScript (Vue 3, NestJS)

**Primary Dependencies**:
- Frontend: Vue 3 + Naive UI, Pinia, Vue Router (hash), Axios
- Backend: NestJS, @nestjs/axios, SSE transport
- Storage: MinIO / Alibaba OSS SDK
- AI Video (Domestic): Seedance 2.0 (Volcengine API, async task)
- AI Video (International): TBD (abstraction layer reserved)
- AI Chat: Existing RAGFlow + multi-LLM provider

**Storage**: MinIO / Alibaba OSS (file uploads, material assets, video output)

**Testing**: NEEDS CLARIFICATION — Vitest + Vue Test Utils (frontend) / Jest (backend) expected, confirm with team

**Target Platform**: Desktop web (modern Chromium-based browsers)

**Project Type**: Web application (frontend + backend)

**Performance Goals**:
- AI chat TTFB < 1s, subsequent tokens < 100ms interval
- Video task submission response < 2s
- Credit balance query < 200ms
- Concurrent video tasks >= 100 (queued)
- File upload success rate >= 99.5%

**Constraints**:
- SSE: handle retry (exponential backoff), partial buffering, stream termination
- File upload: up to 500MB per file, support chunked upload + resume
- Task polling: client-side interval (e.g., every 5-10s)
- Single user concurrency limit on video tasks

**Scale/Scope**: Enterprise platform (DynaXAI), multiple departments, per-user credit system

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

| # | Principle | Status | Notes |
|---|-----------|--------|-------|
| I | Spec-First Development | ✅ PASS | spec.md completed and clarified |
| II | Independent Testability | ✅ PASS | All 6 user stories independently testable |
| III | Type Safety & API Contract First | ⚠️ Partial | Need to define shared TypeScript interfaces in contracts/ |
| IV | SSE Streaming Correctness | ✅ PASS | Retry, buffering, termination patterns defined |
| V | AI Service Abstraction | ✅ PASS | Abstraction layer for Seedance 2.0 and international engine |
| VI | Tech Stack Compliance | ✅ PASS | Vue 3 + Naive UI + NestJS + MinIO/OSS |
| VII | Phase Gates | ✅ PASS | P0→P1→P2 delivery order |
| VIII | No Unjustified Complexity | ✅ PASS | No violations identified |

## Project Structure

### Documentation (this feature)

```text
specs/001-viral-master/
├── plan.md              # This file
├── research.md          # Phase 0 output
├── data-model.md        # Phase 1 output
├── quickstart.md        # Phase 1 output
├── contracts/           # Phase 1 output
└── tasks.md             # Phase 2 output (/speckit.tasks command)
```

### Source Code (repository root)

```text
backend/
├── src/
│   ├── viral-master/
│   │   ├── dto/                    # Request/response DTOs
│   │   ├── interfaces/             # AI service abstraction interfaces
│   │   ├── providers/              # Engine providers (Seedance, international)
│   │   ├── services/               # Business logic
│   │   ├── controllers/            # REST endpoints
│   │   └── sse/                    # SSE streaming handler
│   ├── credit/                     # Credit system (shared)
│   └── material/                   # Material management (shared)
└── tests/
    ├── unit/
    └── integration/

frontend/
├── src/
│   ├── views/
│   │   ├── viral-master/           # Chat page (entry)
│   │   └── video-creation/         # Domestic + international video creation
│   ├── components/
│   │   ├── chat/                   # Chat components (message list, input, cards)
│   │   ├── video/                  # Video creation components
│   │   └── common/                 # Shared components (right panel, nav tree)
│   ├── stores/                     # Pinia stores
│   ├── api/                        # API service layer
│   └── types/                      # Shared TypeScript interfaces
└── tests/
    └── unit/
```

**Structure Decision**: Web application with separate `backend/` and `frontend/` directories, following the existing DynaXAI platform conventions. Feature-specific code organized by module under `viral-master/`.

## Complexity Tracking

No violations — structure stays within one feature branch using existing platform patterns.
