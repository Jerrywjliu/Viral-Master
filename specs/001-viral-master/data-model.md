# Data Model: 爆款大师模块

## Entity Relationships

```
Agent 1──N ChatSession 1──N ChatMessage
                 │
Material ────────┤
                 │
VideoTask N──────1 User (Credit)
                 │
WorksDir (tree) ─┘

Material 1──N VideoTask (input)
VideoTask 1──N VideoOutput
```

---

## Agent（AI 角色）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | Unique identifier |
| name | string | Y | Display name (e.g., "爆款大师") |
| avatar | string | Y | Avatar URL (blue cartoon character) |
| description | string | Y | Subtitle text (e.g., "一键追爆 · AI自动智能体") |
| greeting | string | Y | Welcome message |
| presetQuestions | string[] | Y | 3 preset question cards |
| capabilityCards | CapabilityCard[] | Y | 5 capability entry cards |

### CapabilityCard

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | Card identifier |
| name | string | Y | Display name (e.g., "一键追爆") |
| thumbnail | string | Y | Card thumbnail URL |
| route | string | Y | Target route on click |

---

## ChatSession（对话会话）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | UUID |
| userId | string | Y | Owner user ID |
| agentId | string | Y | Associated agent |
| title | string | N | Auto-generated from first message |
| createdAt | datetime | Y | Creation time |
| updatedAt | datetime | Y | Last activity time |

### Aggregation
- 7天内 / 30天内 / 更早: computed from `updatedAt`

---

## ChatMessage（对话消息）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | UUID |
| sessionId | string | Y | FK → ChatSession |
| role | enum(user, ai) | Y | Message sender |
| content | string | Y | Message text |
| annotations | Annotation[] | N | User notes |
| references | string[] | N | Knowledge base / web search references |
| createdAt | datetime | Y | Creation time |

### Annotation

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | UUID |
| text | string | Y | Note content |
| createdAt | datetime | Y | Creation time |

---

## Character（角色）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | UUID |
| userId | string | Y | Owner user ID |
| name | string | Y | Character name (e.g., "画家", "医生") |
| avatarUrl | string | Y | Character image URL |
| promptTemplate | string | Y | Auto-fill prompt text when referenced |
| voice | string | N | Optional voice clone identifier |
| source | enum(nano-banana, manual-upload) | Y | Creation method |
| createdAt | datetime | Y | Creation time |

---

## Material（素材）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | UUID |
| userId | string | Y | Owner |
| name | string | Y | File name |
| type | enum(image, video, audio) | Y | Media type |
| mimeType | string | Y | e.g., image/jpeg |
| size | number | Y | File size in bytes |
| url | string | Y | Access URL (MinIO/OSS) |
| assetId | string | Y | Storage asset identifier |
| status | enum(normal, processing, failed) | Y | Processing status |
| isPublic | boolean | N | Shared material flag |
| createdAt | datetime | Y | Upload time |

### Constraints
- Max 12 per video task submission
- Max 500MB per file
- Total 10GB per user

---

## VideoTask（视频生成任务）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | UUID |
| userId | string | Y | Owner |
| engine | enum(seedance, kling, ...) | Y | Target engine |
| mode | enum(domestic, international) | Y | Version type |
| subMode | string | Y | Native/LongVideo/Enhanced/CreateCharacter |
| creativeDescription | string | Y | Creative prompt text |
| materialIds | string[] | N | Referenced material IDs |
| modelVersion | string | Y | Engine model version |
| resolution | string | Y | e.g., "1080p" |
| aspectRatio | string | Y | e.g., "9:16" |
| duration | number | Y | Video duration in seconds |
| quantity | number | Y | Number of videos (1/3/5) |
| status | enum(queued, running, succeeded, failed) | Y | Task status |
| progress | number | N | Progress percentage (0-100) |
| creditCost | number | Y | Credits consumed |
| outputs | VideoOutput[] | N | Generated videos |
| errorMessage | string | N | Failure reason |
| createdAt | datetime | Y | Submission time |
| completedAt | datetime | N | Completion time |

### VideoOutput

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | UUID |
| taskId | string | Y | FK → VideoTask |
| url | string | Y | Video access URL (24h expiry) |
| thumbnailUrl | string | N | Thumbnail URL |
| duration | number | Y | Actual video duration |
| createdAt | datetime | Y | Creation time |

---

## WorksDir（作品目录）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | UUID |
| parentId | string | N | FK → WorksDir (null = root) |
| name | string | Y | Directory name |
| type | enum(dir, file) | Y | Node type |
| path | string | Y | Full path hierarchy |
| permission | enum(personal, department, enterprise) | Y | Access level |
| refId | string | N | Reference to VideoTask ID (if type=file) |
| createdAt | datetime | Y | Creation time |

---

## Credit（算力账户）

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| userId | string | Y | PK |
| balance | number | Y | Current credit balance |
| updatedAt | datetime | Y | Last update time |

### CreditTransaction

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| id | string | Y | UUID |
| userId | string | Y | FK → Credit |
| type | enum(deduct, recharge, refund) | Y | Transaction type |
| amount | number | Y | Amount (positive for credit, negative for debit) |
| refType | string | N | Reference entity type (video_task, recharge_order) |
| refId | string | N | Reference entity ID |
| createdAt | datetime | Y | Transaction time |

---

## State Transitions

### VideoTask
```
queued ──→ running ──→ succeeded
   │                    │
   └──→ failed ←───────┘
```

### Material
```
processing ──→ normal
     │
     └──→ failed
```

## Validation Rules

| Entity | Field | Rule |
|--------|-------|------|
| VideoTask | creativeDescription | Required, max 2000 chars (native), max 15000 chars (long video) |
| VideoTask | quantity | Must be 1, 3, or 5 |
| VideoTask | materialIds | Max 12 |
| Material | size | Max 500MB per file |
| VideoTask | status | Cannot resubmit if already queued/running |
| Credit | balance | Must be >= 0 (no negative balance) |
