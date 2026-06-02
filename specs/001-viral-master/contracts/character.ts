// Character Management Contracts

type CharacterSource = 'nano-banana' | 'manual-upload'

interface Character {
  id: string
  name: string
  avatarUrl: string
  promptTemplate: string
  voice?: string
  source: CharacterSource
  createdAt: string
}

interface CreateCharacterRequest {
  name: string
  source: CharacterSource
  referenceImage?: string    // URL for Nano Banana generation
  description?: string       // text prompt for AI generation
  avatarFile?: Blob          // manual upload
  promptTemplate?: string    // custom prompt, auto-generated if empty
}

interface CharacterListResponse {
  items: Character[]
  total: number
}

interface RecentCharacter {
  id: string
  name: string
  avatarUrl: string
  promptTemplate: string
}

// APIs
// POST /api/v1/viral-master/characters           → Character (create)
// GET  /api/v1/viral-master/characters           → CharacterListResponse
// GET  /api/v1/viral-master/characters/recent    → RecentCharacter[]
// PUT  /api/v1/viral-master/characters/:id       → Character (update)
// DELETE /api/v1/viral-master/characters/:id     → void
