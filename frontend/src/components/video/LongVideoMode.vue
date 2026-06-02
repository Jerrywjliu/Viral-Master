<template>
  <div class="long-video-mode">
    <n-card size="small" class="mode-info">
      <template #header>
        <div class="mode-header">
          <n-icon size="20" color="#2b5cf5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
          </n-icon>
          <span>长视频模式</span>
        </div>
      </template>
      <div class="mode-description">
        <p>适用于生成 3-15 分钟的深度视频内容，支持多章节结构和丰富转场效果。</p>
        <ul class="feature-list">
          <li>多章节脚本自动生成</li>
          <li>智能配乐与音效</li>
          <li>自动字幕生成</li>
          <li>支持横版 16:9 和竖版 9:16</li>
        </ul>
      </div>
    </n-card>

    <!-- Chapter management -->
    <div class="chapter-section">
      <div class="chapter-header">
        <span class="chapter-title">章节管理</span>
        <n-button size="tiny" @click="addChapter">
          <template #icon>
            <n-icon>
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="12" height="12"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
            </n-icon>
          </template>
          添加章节
        </n-button>
      </div>

      <n-draggable v-model:value="chapters" item-key="id">
        <template #item="{ element, index }">
          <div class="chapter-item">
            <div class="chapter-index">{{ index + 1 }}</div>
            <div class="chapter-content">
              <n-input
                v-model:value="element.title"
                placeholder="章节标题"
                size="small"
                class="chapter-title-input"
              />
              <n-input
                v-model:value="element.description"
                type="textarea"
                :rows="2"
                placeholder="章节描述..."
                size="small"
                class="chapter-desc-input"
              />
            </div>
            <n-button circle size="tiny" quaternary @click="removeChapter(index)" class="remove-btn">
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
                </n-icon>
              </n-icon>
            </n-button>
          </div>
        </template>
      </n-draggable>
    </div>

    <!-- Transition settings -->
    <div class="transition-section">
      <div class="param-row">
        <span class="param-label">转场风格</span>
        <n-select
          v-model:value="transitionStyle"
          :options="transitionOptions"
          size="small"
          class="param-select"
        />
      </div>
      <div class="param-row">
        <span class="param-label">背景音乐</span>
        <n-select
          v-model:value="bgMusic"
          :options="musicOptions"
          size="small"
          class="param-select"
        />
      </div>
      <div class="param-row">
        <span class="param-label">字幕样式</span>
        <n-select
          v-model:value="subtitleStyle"
          :options="subtitleOptions"
          size="small"
          class="param-select"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Chapter {
  id: string
  title: string
  description: string
}

const chapters = ref<Chapter[]>([
  { id: '1', title: '开篇介绍', description: '引入主题，吸引观众注意力' },
  { id: '2', title: '主体内容', description: '详细讲解核心内容' },
])

const transitionStyle = ref('fade')
const bgMusic = ref('ambient')
const subtitleStyle = ref('bottom')

const transitionOptions = [
  { label: '淡入淡出', value: 'fade' },
  { label: '滑动', value: 'slide' },
  { label: '放大', value: 'zoom' },
  { label: '旋转', value: 'rotate' },
]

const musicOptions = [
  { label: '环境音乐', value: 'ambient' },
  { label: '轻快', value: 'upbeat' },
  { label: '古典', value: 'classical' },
  { label: '电子', value: 'electronic' },
  { label: '无背景音乐', value: 'none' },
]

const subtitleOptions = [
  { label: '底部居中', value: 'bottom' },
  { label: '顶部居中', value: 'top' },
  { label: '底部左对齐', value: 'bottom-left' },
  { label: '无字幕', value: 'none' },
]

let nextId = 3

function addChapter() {
  chapters.value.push({
    id: String(nextId++),
    title: '',
    description: '',
  })
}

function removeChapter(index: number) {
  if (chapters.value.length > 1) {
    chapters.value.splice(index, 1)
  }
}
</script>

<style scoped>
.long-video-mode {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.mode-info {
  background: #f8f9ff;
}

.mode-header {
  display: flex;
  align-items: center;
  gap: 8px;
  font-weight: 600;
}

.mode-description {
  font-size: 13px;
  color: #555;
  line-height: 1.6;
}

.feature-list {
  margin-top: 8px;
  padding-left: 20px;
  font-size: 13px;
  color: #666;
}

.feature-list li {
  margin-bottom: 4px;
}

.chapter-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 10px;
}

.chapter-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.chapter-item {
  display: flex;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
  margin-bottom: 8px;
  align-items: flex-start;
}

.chapter-index {
  width: 24px;
  height: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #2b5cf5;
  color: #fff;
  font-size: 12px;
  font-weight: 600;
  border-radius: 50%;
  flex-shrink: 0;
  margin-top: 4px;
}

.chapter-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.remove-btn {
  color: #999;
}

.remove-btn:hover {
  color: #f44336;
}

.transition-section {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
  background: #f8f9fa;
  border-radius: 8px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.param-label {
  font-size: 13px;
  color: #666;
  min-width: 70px;
  flex-shrink: 0;
}

.param-select {
  flex: 1;
}
</style>
