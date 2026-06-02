<template>
  <div class="message-annotation" :class="[type]">
    <div class="annotation-icon">
      <n-icon size="18">
        <svg v-if="type === 'link'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"/></svg>
        <svg v-else-if="type === 'image'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
        <svg v-else-if="type === 'video'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
        <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M14 2H6c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V8l-6-6zM6 20V4h7v5h5v11H6z"/></svg>
      </n-icon>
    </div>
    <div class="annotation-content">
      <span class="annotation-label">{{ label }}</span>
      <span v-if="url" class="annotation-url">{{ url }}</span>
    </div>
    <n-button v-if="url" text size="tiny" tag="a" :href="url" target="_blank" class="annotation-action">
      查看
    </n-button>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  type: 'link' | 'image' | 'video' | 'file'
  label: string
  url?: string
  thumbnail?: string
}>(), {
  url: '',
  thumbnail: '',
})
</script>

<style scoped>
.message-annotation {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 8px 12px;
  margin-top: 8px;
  background: #f8f9fa;
  border-radius: 8px;
  border: 1px solid #e8ecf1;
  font-size: 13px;
}

.annotation-icon {
  flex-shrink: 0;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #eef1ff;
  border-radius: 6px;
  color: #2b5cf5;
}

.annotation-content {
  flex: 1;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.annotation-label {
  font-weight: 500;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.annotation-url {
  font-size: 12px;
  color: #999;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.annotation-action {
  flex-shrink: 0;
}
</style>
