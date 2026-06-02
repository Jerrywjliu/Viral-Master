---
description: "Task list for 爆款大师模块 (Viral Master Module) feature implementation"
---

# Tasks: 爆款大师模块

**Input**: Design documents from `specs/001-viral-master/`

**Organization**: Tasks grouped by delivery phase per requirements document.

## Format: `[ID] [P?] [Phase?] [Story?] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Phase]**: Delivery phase (MVP, Phase2, Phase3)
- **[Story]**: Which user story this task belongs to (US1-US6)

---

## Phase 0: Setup & Foundational (Shared Infrastructure)

**Purpose**: Project initialization and core infrastructure — must complete before any MVP work

- [ ] T001 Create backend NestJS project with `@nestjs/cli`, configure `package.json` with core dependencies
- [ ] T002 Create frontend Vue 3 + TypeScript + Vite project, install Naive UI, Pinia, Vue Router, Axios
- [ ] T003 [P] Implement shared API response wrapper in `backend/src/common/dto/api-response.ts`
- [ ] T004 [P] Implement SSE streaming infrastructure in `backend/src/common/sse/sse-stream.service.ts`
- [ ] T005 [P] Implement file upload service with chunked upload in `backend/src/common/upload/upload.service.ts`
- [ ] T006 [P] Implement AI service abstraction interface `IVideoProvider` in `backend/src/common/interfaces/`
- [ ] T007 [P] Implement JWT auth guard in `backend/src/common/auth/`
- [ ] T008 [P] Create Axios instance with auth interceptor in `frontend/src/api/`

---

## Phase 1: MVP (US1 + US2 + US3)

**Purpose**: 核心产品交付 — AI 对话、国内视频生成、算力计费

### Story: US1 — AI Chat (一键追爆)

**Independent Test**: 打开爆款大师页面，看到 AI 欢迎消息和 3 个预设问题，点击预设问题或输入任意文本，AI 以流式方式逐字返回回复

- [ ] T009 [P] [MVP] [US1] Create Agent, ChatSession, ChatMessage entities in `backend/src/viral-master/entities/`
- [ ] T010 [P] [MVP] [US1] Implement ChatService in `backend/src/viral-master/services/chat.service.ts`
- [ ] T011 [P] [MVP] [US1] Implement chat SSE handler in `backend/src/viral-master/sse/chat-sse.handler.ts`
- [ ] T012 [MVP] [US1] Implement ChatController in `backend/src/viral-master/controllers/chat.controller.ts`
- [ ] T013 [P] [MVP] [US1] Implement chat Pinia store in `frontend/src/stores/chat.ts`
- [ ] T014 [P] [MVP] [US1] Build SSE client composable in `frontend/src/composables/use-sse.ts`
- [ ] T015 [P] [MVP] [US1] Build chat page layout in `frontend/src/views/viral-master/index.vue`
- [ ] T016 [P] [MVP] [US1] Build ChatMessageList in `frontend/src/components/chat/ChatMessageList.vue`
- [ ] T017 [P] [MVP] [US1] Build ChatInput in `frontend/src/components/chat/ChatInput.vue`
- [ ] T018 [P] [MVP] [US1] Build CapabilityCards in `frontend/src/components/chat/CapabilityCards.vue`
- [ ] T019 [P] [MVP] [US1] Build RightPanel (history + quick buttons) in `frontend/src/components/common/RightPanel.vue`

### Story: US3 — Credit System (算力计费)

**Independent Test**: 查看用户算力余额，模拟不同参数验证算力消耗计算正确，提交任务后余额扣减，余额不足时阻止提交

- [ ] T020 [P] [MVP] [US3] Create Credit + CreditTransaction entities in `backend/src/credit/entities/`
- [ ] T021 [P] [MVP] [US3] Implement CreditService in `backend/src/credit/services/credit.service.ts`
- [ ] T022 [MVP] [US3] Implement CreditController in `backend/src/credit/controllers/credit.controller.ts`
- [ ] T023 [P] [MVP] [US3] Implement credit Pinia store + CreditBadge component in `frontend/src/`

### Story: US2 — Domestic Video Creation (一键大片国内版)

**Independent Test**: 进入国内版模块，上传 1 张图片 + 输入创意描述，选择 9:16 比例，点击开始制作，在我的任务中看到进度，完成后可播放

- [ ] T024 [P] [MVP] [US2] Create Material + VideoTask + VideoOutput + WorksDir entities in `backend/src/viral-master/entities/`
- [ ] T025 [P] [MVP] [US2] Implement SeedanceProvider in `backend/src/viral-master/providers/seedance.provider.ts`
- [ ] T026 [P] [MVP] [US2] Implement MaterialService in `backend/src/viral-master/services/material.service.ts`
- [ ] T027 [P] [MVP] [US2] Implement VideoTaskService in `backend/src/viral-master/services/video-task.service.ts`
- [ ] T028 [MVP] [US2] Implement VideoController + MaterialController in `backend/src/viral-master/controllers/`
- [ ] T029 [P] [MVP] [US2] Implement video + material Pinia stores in `frontend/src/stores/`
- [ ] T030 [P] [MVP] [US2] Build domestic video creation page in `frontend/src/views/video-creation/domestic/index.vue`
- [ ] T031 [P] [MVP] [US2] Build MaterialUploader in `frontend/src/components/video/MaterialUploader.vue`
- [ ] T032 [P] [MVP] [US2] Build CreativeDescription in `frontend/src/components/video/CreativeDescription.vue`
- [ ] T033 [P] [MVP] [US2] Build VideoParams in `frontend/src/components/video/VideoParams.vue`
- [ ] T034 [P] [MVP] [US2] Build TaskList in `frontend/src/components/video/TaskList.vue`
- [ ] T035 [P] [MVP] [US2] Build WorksGallery in `frontend/src/components/video/WorksGallery.vue`

**MVP Checkpoint**: AI 对话 + 国内视频生成 + 算力计费全部可用

---

## Phase 2: Enhancement (US4 + US5)

**Purpose**: 国际版视频生成 + 内容管理系统

### Story: US4 — International Video Creation

**Independent Test**: 进入国际版模块，上传素材，输入英文创意描述，选择 TikTok 比例，提交任务，验证使用国际引擎完成

- [ ] T036 [P] [Phase2] [US4] Implement KlingProvider (or TBD engine) in `backend/src/viral-master/providers/kling.provider.ts`
- [ ] T037 [Phase2] [US4] Add engine routing in VideoTaskService (domestic vs international)
- [ ] T038 [P] [Phase2] [US4] Build international video creation page in `frontend/src/views/video-creation/international/index.vue`
- [ ] T039 [P] [Phase2] [US4] Build VideoParamsInternational for international aspect ratios/models
- [ ] T040 [Phase2] [US4] Build CreativeDescriptionInternational for multi-language input

### Story: US5 — Content Management

**Independent Test**: 发起对话后右侧栏看到按时间分组的历史会话；上传素材后可在素材库查看；生成视频后可在作品库按目录树查找

- [ ] T041 [P] [Phase2] [US5] Add annotation service endpoints in ChatController
- [ ] T042 [P] [Phase2] [US5] Implement WorkspaceController for directory tree CRUD
- [ ] T043 [Phase2] [US5] Implement material library list API with type filter + pagination
- [ ] T044 [P] [Phase2] [US5] Build MaterialLibrary page in `frontend/src/views/video-creation/MaterialLibrary.vue`
- [ ] T045 [P] [Phase2] [US5] Build WorkspaceTree component in `frontend/src/components/common/WorkspaceTree.vue`
- [ ] T046 [P] [Phase2] [US5] Build WorksLibrary view in `frontend/src/components/video/WorksLibrary.vue`
- [ ] T047 [Phase2] [US5] Add message annotation UI in `frontend/src/components/chat/MessageAnnotation.vue`

**Phase 2 Checkpoint**: 国际版可用 + 素材/作品可按目录管理

---

## Phase 3: Advanced (US6)

**Purpose**: AI 润色、长视频模式、对话导出/分享

### Story: US6 — AI Polish & Export

**Independent Test**: 输入粗糙文案，点击 AI 润色验证优化；长视频版预设模板可一键填充；对话可导出 Word 文档

- [ ] T048 [P] [Phase3] [US6] Implement AI polish endpoint in ChatController (reuse LLM, polish system prompt)
- [ ] T049 [P] [Phase3] [US6] Implement Word export endpoint — POST /chat/sessions/:id/export
- [ ] T050 [P] [Phase3] [US6] Implement share endpoint — POST /chat/sessions/:id/share
- [ ] T051 [P] [Phase3] [US6] Wire AI polish button in CreativeDescription with accept/revert diff
- [ ] T052 [P] [Phase3] [US6] Build export/share UI in chat page (Word download, share link copy)
- [ ] T053 [Phase3] [US6] Build LongVideoMode component with preset template selector

---

## Phase 4: Polish & Cross-Cutting

**Purpose**: 完善跨模块的非功能性需求

- [ ] T054 [P] Add loading states, error boundaries, and skeleton screens across all pages
- [ ] T055 [P] Add responsive layout adjustments for the three-column layout
- [ ] T056 Add comprehensive logging and monitoring integration
- [ ] T057 Run end-to-end validation per quickstart.md

---

## Dependencies & Execution Order

### Phase Dependencies

```
Phase 0 (Setup & Foundational)
         │
         └── Phase 1 (MVP: US1 + US2 + US3)
                  ├── US1 AI Chat ────── independent of other stories
                  ├── US3 Credit ─────── independent of other stories
                  └── US2 Domestic ───── depends on US3 (credit check)
         │
         └── Phase 2 (US4 + US5)
                  ├── US4 International ─ depends on US3 (credit)
                  └── US5 Content Mgmt ── depends on US2 (works)
         │
         └── Phase 3 (US6)
                  └── US6 Polish/Export ─ depends on US1 + US2
```

### Parallel Opportunities

- US1 and US3 can be built in parallel within Phase 1
- US4 and US5 can be built in parallel within Phase 2
- All [P] tasks within any phase can run in parallel

---

## Parallel Example: Phase 1 MVP

```bash
# US1 + US3 in parallel:
# Developer A: US1 entities + ChatService + ChatController + SSE
# Developer B: US3 entities + CreditService + CreditController
# Developer C (after US3): US2 entities + SeedanceProvider + VideoTaskService

# Frontend in parallel:
# Developer A: Chat page + ChatMessageList + ChatInput
# Developer B: CapabilityCards + RightPanel
# Developer C: CreditBadge + MaterialUploader + VideoParams
```

---

## Implementation Strategy

### MVP First (Phase 1 only)

1. Phase 0: Setup + Foundational ✓
2. Phase 1: US1 (AI Chat) + US3 (Credit) + US2 (Domestic video)
3. **STOP and VALIDATE**: Test all 3 stories independently
4. Deploy MVP

### Incremental Delivery

1. Phase 0 → Foundation ready
2. Phase 1 → MVP (chat + video + credit) → Deploy
3. Phase 2 → International + Content management → Deploy
4. Phase 3 → Advanced features → Deploy
5. Phase 4 → Polish
