<template>
  <div class="task-list">
    <div v-if="tasks.length === 0" class="empty-tasks">
      <n-empty description="暂无任务" />
    </div>

    <div v-for="task in tasks" :key="task.id" class="task-card">
      <div class="task-header">
        <div class="task-title">{{ task.title || `任务 ${task.id.substring(0, 8)}` }}</div>
        <n-tag :type="statusType(task.status)" size="small" :bordered="false">
          {{ statusLabel(task.status) }}
        </n-tag>
      </div>

      <!-- Progress bar for processing tasks -->
      <n-progress
        v-if="task.status === 'processing'"
        type="line"
        :percentage="task.progress"
        :height="6"
        :indicator-placement="'inside'"
        class="task-progress"
      />

      <div class="task-meta">
        <span class="meta-item">素材: {{ task.materialCount }}个</span>
        <span class="meta-item">{{ task.createdAt }}</span>
      </div>

      <!-- Video outputs -->
      <div v-if="task.output && task.output.length" class="task-outputs">
        <div v-for="output in task.output" :key="output.id" class="output-card">
          <div class="output-thumbnail">
            <img :src="output.thumbnail" :alt="output.title" />
            <div class="output-overlay">
              <n-button circle size="small" type="primary" class="play-btn">
                <template #icon>
                  <n-icon size="18">
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M8 5v14l11-7z"/></svg>
                  </n-icon>
                </template>
              </n-button>
            </div>
          </div>
          <div class="output-info">
            <div class="output-title">{{ output.title }}</div>
            <div class="output-meta">
              <span>{{ formatDuration(output.duration) }}</span>
              <span>{{ formatSize(output.size) }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { VideoTask, TaskStatus } from '@/types'

defineProps<{
  tasks: VideoTask[]
}>()

function statusType(status: TaskStatus): 'warning' | 'info' | 'success' | 'error' {
  switch (status) {
    case 'queued': return 'warning'
    case 'processing': return 'info'
    case 'completed': return 'success'
    case 'failed': return 'error'
  }
}

function statusLabel(status: TaskStatus): string {
  switch (status) {
    case 'queued': return '排队中'
    case 'processing': return '制作中'
    case 'completed': return '已完成'
    case 'failed': return '失败'
  }
}

function formatDuration(seconds: number): string {
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
.task-list {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.empty-tasks {
  padding: 40px 0;
}

.task-card {
  background: #fff;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  padding: 16px;
}

.task-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.task-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.task-progress {
  margin-bottom: 8px;
}

.task-meta {
  display: flex;
  gap: 16px;
  font-size: 12px;
  color: #999;
}

.task-outputs {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(160px, 1fr));
  gap: 10px;
  margin-top: 12px;
}

.output-card {
  border: 1px solid #e8ecf1;
  border-radius: 8px;
  overflow: hidden;
  transition: box-shadow 0.2s;
}

.output-card:hover {
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.output-thumbnail {
  position: relative;
  width: 100%;
  aspect-ratio: 9 / 16;
  background: #f0f0f0;
  overflow: hidden;
}

.output-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.output-overlay {
  position: absolute;
  inset: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(0, 0, 0, 0.3);
  opacity: 0;
  transition: opacity 0.2s;
}

.output-card:hover .output-overlay {
  opacity: 1;
}

.play-btn {
  background: rgba(255, 255, 255, 0.9);
  color: #333;
}

.output-info {
  padding: 8px 10px;
}

.output-title {
  font-size: 13px;
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.output-meta {
  display: flex;
  justify-content: space-between;
  font-size: 11px;
  color: #999;
  margin-top: 2px;
}
</style>
