<template>
  <div class="material-library">
    <div class="library-controls">
      <n-input
        v-model:value="searchText"
        placeholder="搜索素材..."
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
      <n-button size="small" @click="emit('upload')">
        <template #icon>
          <n-icon>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
          </n-icon>
        </template>
        上传
      </n-button>
    </div>

    <!-- Type filter tabs -->
    <n-tabs v-model:value="typeFilter" size="small" type="line" class="type-tabs">
      <n-tab name="all" tab="全部" />
      <n-tab name="video" tab="视频" />
      <n-tab name="image" tab="图片" />
      <n-tab name="audio" tab="音频" />
    </n-tabs>

    <div v-if="filteredMaterials.length === 0" class="empty-state">
      <n-empty description="暂无素材" />
    </div>

    <div v-else class="material-grid">
      <div
        v-for="mat in filteredMaterials"
        :key="mat.id"
        class="material-item"
        @click="emit('select', mat)"
      >
        <div class="mat-thumb">
          <img v-if="mat.type === 'image'" :src="mat.thumbnail" :alt="mat.name" />
          <div v-else class="mat-icon-wrapper">
            <n-icon size="32" :color="mat.type === 'video' ? '#2b5cf5' : '#10b981'">
              <svg v-if="mat.type === 'video'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            </n-icon>
          </div>
          <div class="mat-duration" v-if="mat.duration">{{ formatDuration(mat.duration) }}</div>
        </div>
        <div class="mat-info">
          <div class="mat-name">{{ mat.name }}</div>
          <div class="mat-size">{{ formatSize(mat.size) }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Material } from '@/types'

const props = defineProps<{
  materials: Material[]
}>()

const emit = defineEmits<{
  (e: 'select', material: Material): void
  (e: 'upload'): void
}>()

const searchText = ref('')
const typeFilter = ref('all')

const filteredMaterials = computed(() => {
  let result = [...props.materials]

  if (typeFilter.value !== 'all') {
    result = result.filter((m) => m.type === typeFilter.value)
  }

  if (searchText.value.trim()) {
    const q = searchText.value.toLowerCase()
    result = result.filter((m) => m.name.toLowerCase().includes(q))
  }

  return result
})

function formatDuration(seconds?: number): string {
  if (!seconds) return ''
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)}KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)}MB`
}
</script>

<style scoped>
.material-library {
  padding: 4px;
}

.library-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
}

.search-input {
  flex: 1;
}

.type-tabs {
  margin-bottom: 8px;
}

.empty-state {
  padding: 40px 0;
}

.material-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(130px, 1fr));
  gap: 8px;
}

.material-item {
  cursor: pointer;
  border: 1px solid #e8ecf1;
  border-radius: 8px;
  overflow: hidden;
  transition: all 0.2s;
}

.material-item:hover {
  border-color: #2b5cf5;
  box-shadow: 0 2px 6px rgba(43, 92, 245, 0.1);
}

.mat-thumb {
  position: relative;
  width: 100%;
  aspect-ratio: 1;
  background: #f5f6f7;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.mat-thumb img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.mat-icon-wrapper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.mat-duration {
  position: absolute;
  bottom: 4px;
  right: 4px;
  padding: 1px 5px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  border-radius: 3px;
}

.mat-info {
  padding: 6px 8px;
}

.mat-name {
  font-size: 12px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.mat-size {
  font-size: 11px;
  color: #999;
  margin-top: 1px;
}
</style>
