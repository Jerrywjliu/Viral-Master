<template>
  <div class="character-list">
    <div class="section-label">最近使用形象</div>

    <div v-if="characters.length === 0" class="empty-characters">
      <n-empty description="暂无形象" :size="'small'" />
    </div>

    <div v-else class="characters-row">
      <div
        v-for="char in characters"
        :key="char.id"
        class="character-item"
        :class="{ selected: selectedId === char.id }"
        @click="handleSelect(char)"
      >
        <n-avatar :src="char.avatar" :size="40" round fallback-src="data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0MCIgaGVpZ2h0PSI0MCIgdmlld0JveD0iMCAwIDI0IDI0IiBmaWxsPSIjYmJiIj48cGF0aCBkPSJNMTIgMTJjMi4yMSAwIDQtMS43OSA0LTRzLTEuNzktNC00LTQtNCAxLjc5LTQgNCAxLjc5IDQgNCA0em0wIDJjLTIuNjcgMC04IDEuMzQtOCA0djJoMTZ2LTJjMC0yLjY2LTUuMzMtNC04LTR6Ii8+PC9zdmc+" />
        <div class="char-name">{{ char.name }}</div>
      </div>
    </div>

    <n-button size="tiny" quaternary class="create-btn" @click="handleCreate">
      <template #icon>
        <n-icon>
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
        </n-icon>
      </template>
      创建形象
    </n-button>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Character } from '@/types'

defineProps<{
  characters: Character[]
  selectedId?: string
}>()

const emit = defineEmits<{
  (e: 'select', character: Character): void
  (e: 'create'): void
}>()

const selectedId = ref('')

function handleSelect(char: Character) {
  selectedId.value = char.id
  emit('select', char)
}

function handleCreate() {
  emit('create')
}
</script>

<style scoped>
.character-list {
  margin-bottom: 16px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.empty-characters {
  padding: 16px 0;
}

.characters-row {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.character-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  cursor: pointer;
  padding: 8px 12px;
  border-radius: 8px;
  border: 2px solid transparent;
  transition: all 0.2s;
  flex-shrink: 0;
}

.character-item:hover {
  background: #f5f7ff;
}

.character-item.selected {
  border-color: #2b5cf5;
  background: #eef1ff;
}

.char-name {
  font-size: 11px;
  color: #666;
  max-width: 56px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  text-align: center;
}

.create-btn {
  margin-top: 8px;
  color: #2b5cf5;
}
</style>
