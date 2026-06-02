<template>
  <div class="chat-message-list" ref="listRef">
    <!-- AI Role Header -->
    <div class="ai-role-header">
      <n-avatar
        :size="48"
        color="#2b5cf5"
        class="role-avatar"
      >
        <n-icon size="24">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
        </n-icon>
      </n-avatar>
      <div class="role-info">
        <div class="role-name">爆款大师</div>
        <div class="role-desc">一键追爆 · AI自动智能体</div>
      </div>
    </div>

    <!-- Preset Questions -->
    <div v-if="messages.length === 0" class="preset-questions">
      <n-card
        v-for="q in presetQuestions"
        :key="q.id"
        class="preset-card"
        hoverable
        @click="handlePresetClick(q.text)"
      >
        {{ q.text }}
      </n-card>
    </div>

    <!-- Messages -->
    <div v-for="msg in messages" :key="msg.id" class="message-wrapper" :class="msg.role">
      <n-avatar
        v-if="msg.role === 'assistant'"
        :size="36"
        color="#2b5cf5"
        class="msg-avatar"
      >
        <n-icon size="18">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
        </n-icon>
      </n-avatar>
      <div class="message-bubble" :class="msg.role">
        <div class="message-content" v-html="renderContent(msg.content)"></div>
        <div v-if="msg.annotations && msg.annotations.length" class="message-annotations">
          <MessageAnnotation
            v-for="ann in msg.annotations"
            :key="ann.id"
            :type="ann.type"
            :label="ann.label"
            :url="ann.url"
          />
        </div>
        <div class="message-time">{{ formatTime(msg.timestamp) }}</div>
      </div>
    </div>

    <!-- Loading -->
    <div v-if="isLoading" class="message-wrapper assistant">
      <n-avatar :size="36" color="#2b5cf5" class="msg-avatar">
        <n-icon size="18">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
        </n-icon>
      </n-avatar>
      <div class="message-bubble assistant">
        <n-spin :size="18" />
        <span style="margin-left: 8px; color: #999;">思考中...</span>
      </div>
    </div>

    <!-- Empty state -->
    <n-empty v-if="!isLoading && messages.length === 0" description="开始对话吧！" class="empty-state" />
  </div>
</template>

<script setup lang="ts">
import { ref, nextTick, watch } from 'vue'
import { useChatStore } from '@/stores/chat'
import MessageAnnotation from '@/components/common/MessageAnnotation.vue'

const chatStore = useChatStore()
const listRef = ref<HTMLElement | null>(null)

const messages = chatStore.messages
const isLoading = chatStore.isLoading
const presetQuestions = chatStore.presetQuestions

const emit = defineEmits<{
  (e: 'preset', text: string): void
  (e: 'scroll-to-bottom'): void
}>()

function handlePresetClick(text: string) {
  emit('preset', text)
}

function renderContent(content: string): string {
  // Simple markdown-like rendering - convert newlines to <br> and bold
  return content
    .replace(/\n/g, '<br>')
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
}

function formatTime(timestamp: number): string {
  const date = new Date(timestamp)
  const now = new Date()
  const diff = now.getTime() - date.getTime()
  if (diff < 60000) return '刚刚'
  if (diff < 3600000) return `${Math.floor(diff / 60000)}分钟前`
  if (diff < 86400000) return `${Math.floor(diff / 3600000)}小时前`
  return date.toLocaleDateString('zh-CN', { month: 'numeric', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}

// Auto scroll to bottom when new messages arrive
watch(
  () => messages.length,
  async () => {
    await nextTick()
    if (listRef.value) {
      listRef.value.scrollTop = listRef.value.scrollHeight
    }
  },
)
</script>

<style scoped>
.chat-message-list {
  flex: 1;
  overflow-y: auto;
  padding: 20px 24px;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.ai-role-header {
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 16px;
  background: linear-gradient(135deg, #eef1ff 0%, #f5f7ff 100%);
  border-radius: 12px;
  margin-bottom: 8px;
}

.role-avatar {
  flex-shrink: 0;
}

.role-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.role-name {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.role-desc {
  font-size: 13px;
  color: #888;
}

.preset-questions {
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 8px 0;
}

.preset-card {
  cursor: pointer;
  font-size: 14px;
  border-radius: 10px;
  transition: all 0.2s;
}

.preset-card:hover {
  border-color: #2b5cf5;
  box-shadow: 0 2px 8px rgba(43, 92, 245, 0.1);
}

.message-wrapper {
  display: flex;
  gap: 10px;
  max-width: 80%;
}

.message-wrapper.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.msg-avatar {
  flex-shrink: 0;
}

.message-bubble {
  padding: 12px 16px;
  border-radius: 12px;
  font-size: 14px;
  line-height: 1.6;
  word-break: break-word;
}

.message-bubble.assistant {
  background: #fff;
  border: 1px solid #e8ecf1;
  color: #333;
  border-top-left-radius: 4px;
}

.message-bubble.user {
  background: #2b5cf5;
  color: #fff;
  border-top-right-radius: 4px;
}

.message-content {
  white-space: pre-wrap;
}

.message-annotations {
  margin-top: 8px;
}

.message-time {
  font-size: 12px;
  color: #aaa;
  margin-top: 4px;
  text-align: right;
}

.message-bubble.user .message-time {
  color: rgba(255, 255, 255, 0.7);
}

.empty-state {
  margin-top: 60px;
}
</style>
