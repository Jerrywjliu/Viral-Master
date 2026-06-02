<!--
  Sync Impact Report
  Version change: 0.1.0 → 1.0.0
  Modified principles: N/A (initial creation)
  Added sections: Core Principles (5), Tech Stack & Architecture, Development Workflow, Governance
  Removed sections: N/A
  Templates requiring updates: ✅ constitution-template.md (source), ✅ spec-template.md (reviewed), ✅ plan-template.md (reviewed), ✅ tasks-template.md (reviewed)
  Follow-up TODOs: RATIFICATION_DATE set to 2026-05-31 (project init date)
-->

# Viral Master Module Constitution

## Core Principles

### I. Spec-First Development
Every feature MUST start with a specification before any implementation code is written. Specifications define the WHAT and WHY, not the HOW. The `/speckit.constitution` → `/speckit.specify` → `/speckit.plan` → `/speckit.tasks` → `/speckit.implement` workflow MUST be followed in order.

### II. Independent Testability (NON-NEGOTIABLE)
Each user story MUST be independently testable and deliverable. Every feature slice MUST demonstrate value on its own without requiring other stories. Tests MUST be written and approved before implementation begins.

### III. Type Safety & API Contract First
Frontend (Vue 3 + TypeScript) and backend (NestJS) MUST share type definitions for all API contracts. All API responses MUST have corresponding TypeScript interfaces. Breaking changes to API contracts MUST be versioned.

### IV. SSE Streaming Correctness
All AI chat features using Server-Sent Events MUST handle: connection retry with exponential backoff, partial message buffering, proper stream termination detection, and graceful degradation when the stream fails mid-response.

### V. AI Service Abstraction
All external AI/video engine integrations (Seedance 2.0, international engines) MUST be behind an abstraction layer. No direct vendor API calls outside the dedicated provider module. Each provider MUST implement a common interface for submission, status polling, and callback handling.

## Tech Stack & Architecture

The project is part of the DynaXAI platform. The agreed tech stack MUST NOT be changed without explicit plan revision:

| Layer | Technology |
|-------|-----------|
| Frontend Framework | Vue 3 + Naive UI |
| State Management | Pinia |
| Routing | Vue Router (hash mode) |
| HTTP Client | Axios + Bearer Token (JWT) |
| Backend | NestJS |
| Storage | MinIO / Alibaba OSS |
| AI Video Engine (Domestic) | Seedance 2.0 (Volcengine) |
| AI Video Engine (International) | TBD international engine |
| AI Chat | Custom AI Provider with SSE |

## Development Workflow

1. **Branch Convention**: Feature branches follow `[###-feature-name]` pattern (e.g., `001-one-click-viral`)
2. **Implementation Order**: Follow priority (P0 → P1 → P2) as defined in the specification
3. **Phase Gates**:
   - Phase 1 (MVP): One-Click Viral chat + One-Click Masterpiece Domestic basic flow + Compute power system
   - Phase 2: International version + History + Material library
   - Phase 3: AI polish + Long video + Export features
4. **Commit Style**: Conventional commits (`feat:`, `fix:`, `docs:`, `refactor:`, `test:`)
5. **Code Review**: All PRs MUST verify compliance with this constitution

## Governance

This constitution supersedes ad-hoc development decisions. Amendments require documentation of the change, approval rationale, and a migration plan. All PRs and implementation reviews must verify compliance with these principles. Complexity MUST be justified — prefer simple solutions over over-engineered abstractions. Use AGENTS.md for runtime development guidance.

**Version**: 1.0.0 | **Ratified**: 2026-05-31 | **Last Amended**: 2026-05-31
