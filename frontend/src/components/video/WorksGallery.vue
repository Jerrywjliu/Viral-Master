<template>
  <div class="works-gallery">
    <div v-if="works.length === 0" class="empty-works">
      <n-empty description="暂无作品">
        <template #extra>
          <n-button size="small" @click="handleBack">去生成视频</n-button>
        </template>
      </n-empty>
    </div>

    <div v-for="work in works" :key="work.id" class="work-card">
      <div class="work-thumbnail">
        <img :src="work.thumbnail" :alt="work.title" />
        <div class="work-duration">{{ formatDuration(work.duration) }}</div>
      </div>
      <div class="work-info">
        <div class="work-title">{{ work.title }}</div>
        <div class="work-desc">
          <n-ellipsis :line-clamp="2">
            {{ work.description || 'AI 智能生成视频' }}
          </n-ellipsis>
        </div>
        <div class="work-meta">
          <span class="work-model">{{ work.model || 'GPT-4o' }}</span>
          <n-button size="tiny" type="primary" quaternary @click="handleRegenerate(work)">
            生成同款
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
interface WorkItem {
  id: string
  title: string
  thumbnail: string
  duration: number
  description?: string
  model?: string
  url?: string
}

defineProps<{
  works: WorkItem[]
}>()

const emit = defineEmits<{
  (e: 'regenerate', work: WorkItem): void
  (e: 'back'): void
}>()

function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60)
  const s = seconds % 60
  return `${m}:${s.toString().padStart(2, '0')}`
}

function handleRegenerate(work: WorkItem) {
  emit('regenerate', work)
}

function handleBack() {
  emit('back')
}
</script>

<style scoped>
.works-gallery {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(180px, 1fr));
  gap: 12px;
  padding: 4px;
}

.empty-works {
  grid-column: 1 / -1;
  padding: 60px 0;
}

.work-card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  overflow: hidden;
  transition: all 0.2s;
}

.work-card:hover {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  transform: translateY(-2px);
}

.work-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  background: #f0f0f0;
  overflow: hidden;
}

.work-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.work-duration {
  position: absolute;
  bottom: 6px;
  right: 6px;
  padding: 2px 6px;
  background: rgba(0, 0, 0, 0.6);
  color: #fff;
  font-size: 11px;
  border-radius: 4px;
}

.work-info {
  padding: 10px 12px;
}

.work-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.work-desc {
  font-size: 12px;
  color: #888;
  margin-top: 4px;
  line-height: 1.4;
}

.work-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.work-model {
  font-size: 11px;
  color: #aaa;
  padding: 2px 6px;
  background: #f5f6f7;
  border-radius: 4px;
}
</style>
