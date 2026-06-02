<template>
  <div class="works-library">
    <div class="library-header">
      <n-input
        v-model:value="searchQuery"
        placeholder="搜索作品..."
        size="small"
        clearable
        class="search-input"
      >
        <template #prefix>
          <n-icon size="14">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>
          </n-icon>
        </template>
      </n-input>
      <div class="sort-buttons">
        <n-button
          v-for="opt in sortOptions"
          :key="opt.value"
          size="tiny"
          :type="sortBy === opt.value ? 'primary' : 'default'"
          @click="sortBy = opt.value"
        >
          {{ opt.label }}
        </n-button>
      </div>
    </div>

    <div v-if="filteredWorks.length === 0" class="empty-state">
      <n-empty description="暂无匹配的作品" />
    </div>

    <div v-else class="works-grid">
      <div v-for="work in filteredWorks" :key="work.id" class="work-item" @click="emit('preview', work)">
        <div class="work-thumb">
          <img :src="work.thumbnail" :alt="work.title" />
          <div class="work-overlay">
            <n-icon size="32" color="#fff">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
            </n-icon>
          </div>
        </div>
        <div class="work-detail">
          <div class="work-name">{{ work.title }}</div>
          <div class="work-time">{{ work.createdAt }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

interface LibraryWork {
  id: string
  title: string
  thumbnail: string
  createdAt: string
  duration?: number
}

const props = defineProps<{
  works: LibraryWork[]
}>()

const emit = defineEmits<{
  (e: 'preview', work: LibraryWork): void
}>()

const searchQuery = ref('')
const sortBy = ref('newest')

const sortOptions = [
  { label: '最新', value: 'newest' },
  { label: '最旧', value: 'oldest' },
  { label: '名称', value: 'name' },
]

const filteredWorks = computed(() => {
  let result = [...props.works]

  if (searchQuery.value.trim()) {
    const q = searchQuery.value.toLowerCase()
    result = result.filter((w) => w.title.toLowerCase().includes(q))
  }

  switch (sortBy.value) {
    case 'newest':
      result.sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      break
    case 'oldest':
      result.sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      break
    case 'name':
      result.sort((a, b) => a.title.localeCompare(b.title))
      break
  }

  return result
})
</script>

<style scoped>
.works-library {
  padding: 4px;
}

.library-header {
  display: flex;
  gap: 8px;
  margin-bottom: 12px;
}

.search-input {
  flex: 1;
}

.sort-buttons {
  display: flex;
  gap: 4px;
}

.empty-state {
  padding: 40px 0;
}

.works-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(150px, 1fr));
  gap: 10px;
}

.work-item {
  cursor: pointer;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid #e8ecf1;
  transition: all 0.2s;
}

.work-item:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.work-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  background: #f0f0f0;
  overflow: hidden;
}

.work-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  opacity: 0;
  transition: opacity 0.2s;
}

.work-item:hover .work-overlay {
  opacity: 1;
}

.work-detail {
  padding: 8px 10px;
}

.work-name {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.work-time {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
</style>
