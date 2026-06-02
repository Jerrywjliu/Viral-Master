# Specification Analysis Report: 爆款大师模块

**Date**: 2026-06-01 | **Read-Only Analysis**

## Findings

| ID | Category | Severity | Location | Summary | Recommendation |
|----|----------|----------|----------|---------|----------------|
| A1 | Coverage Gap | MEDIUM | spec.md:FR-007 | FR-007（左侧部门层级导航树）在 tasks.md 中无对应任务 | 确认是否为平台已有组件。如本模块需实现，在 Phase 0 添加任务 |
| A2 | Coverage Gap | MEDIUM | spec.md:FR-029 | FR-029（最近使用角色快捷插入）无明确对应任务 | T032 (CreativeDescription) 范围已包含，建议在 T032 描述中明确提及 |
| A3 | Underspecification | MEDIUM | tasks.md:T019 | FR-005（联网搜索+知识库开关）前端 T019 实现 UI，但后端任务未明确标注对应的 LLM Provider 参数传递逻辑 | T011 ChatService 需明确处理 webSearch/knowledgeBase 参数 |
| A4 | Coverage Gap | HIGH | spec.md:SC-001~SC-009 | 9 个 Success Criteria 均无对应具体任务（性能、成功率、耗时等） | 在 Phase 4 添加性能验证任务，或确认这些指标由架构保证无需独立任务 |
| A5 | Inconsistency | LOW | spec.md vs tasks.md | FR-030（长视频版 15000 字）在 Phase 3 (US6) 实现，但模式切换 [原生版][长视频版] 在 Phase 1 (US2) 已有 | 确认：Phase 1 展示切换按钮但仅加载原生版，Phase 3 才实现长视频完整功能——这是合理的增量策略 |
| A6 | Terminology Drift | LOW | plan.md vs spec.md | plan.md 中 "增强版" vs spec.md FR-020 中 "增强版"（已改为国际版专属） | 已验证一致 ✅ |
| A7 | Ambiguity | LOW | tasks.md | 任务轮询间隔未指定 | 建议确认 polling interval（research.md 建议 5-10s）|
| A8 | Duplication | LOW | plan.md vs spec.md | plan.md 部分 Technical Context 与 spec.md Success Criteria 重复 | 无实质影响 |

## Coverage Summary

| Requirement | Has Task? | Task IDs | Notes |
|-------------|-----------|----------|-------|
| FR-001 AI角色展示 | ✅ | T015 | Chat page layout |
| FR-002 预设问题 | ✅ | T015, T016 | Preset questions in chat |
| FR-003 SSE流式 | ✅ | T004, T013, T014 | SSE infra + handler + client |
| FR-004 输入框+发送 | ✅ | T017 | ChatInput |
| FR-005 联网+知识库开关 | ⚠️ | T017, T011 | 前端 UI 有，后端参数传递需确认 |
| FR-006 能力卡片独立滚动 | ✅ | T018 | CapabilityCards |
| FR-007 左侧导航树 | ❌ | — | 可能是平台已有组件 |
| FR-008 右侧面板默认展开 | ✅ | T019 | RightPanel |
| FR-020 国内版布局+模式切换 | ✅ | T030 | Domestic page |
| FR-021 素材上传最多12个 | ✅ | T005, T031 | Upload service + MaterialUploader |
| FR-022 创意描述+@引用 | ✅ | T032 | CreativeDescription |
| FR-023 视频参数配置 | ✅ | T033 | VideoParams |
| FR-024 开始制作+预估算力 | ✅ | T027, T033 | VideoTaskService + VideoParams |
| FR-025 我的任务视图 | ✅ | T034 | TaskList |
| FR-026 我的作品视图 | ✅ | T035 | WorksGallery |
| FR-027 AI润色 | ✅ | T048, T051 | Backend polish + frontend wire |
| FR-028 Nano Banana入口 | ✅ | T031 | MaterialUploader |
| FR-029 最近角色快捷插入 | ⚠️ | T032 | 需在描述中明确提及 |
| FR-030 长视频版模式 | ✅ | T053 | LongVideoMode (Phase 3) |
| FR-040 算力余额维护 | ✅ | T020-T023 | Credit system |
| FR-041 实时预估算力 | ✅ | T033 | VideoParams 调用 credit/estimate |
| FR-042 提交校验余额 | ✅ | T027, T028 | VideoTaskService |
| FR-043 提交后扣除余额 | ✅ | T027 | VideoTaskService |
| FR-050 国际版结构一致 | ✅ | T038 | International page |
| FR-051 国际版模式切换 | ✅ | T038 | International page tabs |
| FR-052 独立国际引擎 | ✅ | T036 | KlingProvider |
| FR-053 独立模型选项 | ✅ | T039 | VideoParamsInternational |
| FR-054 多语言创意描述 | ✅ | T040 | CreativeDescriptionInternational |
| FR-055 国际平台比例 | ✅ | T039 | VideoParamsInternational |
| FR-060 历史会话列表 | ✅ | T019, T046 | RightPanel + session history |
| FR-061 AI回复添加笔记 | ✅ | T041, T047 | Annotation API + UI |
| FR-062 素材库管理 | ✅ | T044 | MaterialLibrary |
| FR-063 作品库目录树 | ✅ | T042, T045, T046 | Workspace API + UI |
| FR-070 导出Word | ✅ | T049, T052 | Export endpoint + UI |
| FR-071 分享对话 | ✅ | T050, T052 | Share endpoint + UI |

## Constitution Alignment Issues

| Principle | Status | Detail |
|-----------|--------|--------|
| I. Spec-First | ✅ | All artifacts exist and follow workflow |
| II. Independent Testability | ✅ | Each story has independent test criteria |
| III. Type Safety & API Contracts | ✅ | contracts/ defined, shared types across FE/BE |
| IV. SSE Correctness | ✅ | Retry, buffering, termination in research.md |
| V. AI Service Abstraction | ✅ | IVideoProvider + SeedanceProvider + KlingProvider |
| VI. Tech Stack | ✅ | Vue 3 + NestJS + MinIO |
| VII. Phase Gates | ✅ | P1→P2→P3 |

## Metrics

| Metric | Value |
|--------|-------|
| Total FRs | 35 |
| Total SCs | 9 |
| Total Tasks | 57 |
| Coverage % (FRs with ≥1 task) | 94% (33/35) |
| Coverage % (FRs with explicit task) | 91% (32/35) |
| Ambiguity Count | 1 |
| Duplication Count | 1 |
| Critical Issues | 0 |
| High Issues | 1 (A4: SCs lacking tasks) |

## Next Actions

- **1 HIGH issue**: SC-001~SC-009 无对应任务。建议在 Phase 4 添加性能验证任务或确认这些由架构保证
- **2 MEDIUM issues**: FR-007 和 FR-029 覆盖缺失，建议确认
- 其余均为 LOW，不影响实现启动

## Recommendation

可以进入 `/speckit.implement` 开始实现。建议在 implement 前确认 A4（SC 任务）是否需要补充。
