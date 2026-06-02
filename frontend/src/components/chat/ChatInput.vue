<template>
  <div class="chat-input-area">
    <div class="input-wrapper">
      <n-input
        v-model:value="inputText"
        type="textarea"
        :rows="3"
        placeholder="输入您的问题，例如：帮我写一个短视频脚本..."
        :autosize="{ minRows: 2, maxRows: 6 }"
        :disabled="disabled"
        @keydown.enter="handleSend"
      />
      <div class="input-toolbar">
        <div class="toolbar-left">
          <n-dropdown trigger="click" :options="internetOptions" @select="handleInternetSelect">
            <n-button size="tiny" quaternary class="tool-btn">
              <template #icon>
                <n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg></n-icon>
              </template>
              联网{{ internetLabel }}
            </n-button>
          </n-dropdown>
          <n-dropdown trigger="click" :options="knowledgeOptions" @select="handleKnowledgeSelect">
            <n-button size="tiny" quaternary class="tool-btn">
              <template #icon>
                <n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg></n-icon>
              </template>
              知识库{{ knowledgeLabel }}
            </n-button>
          </n-dropdown>
        </div>
        <div class="toolbar-right">
          <span class="word-count">{{ inputText.length }}</span>
          <n-button
            type="primary"
            :disabled="!inputText.trim() || disabled"
            :loading="disabled"
            @click="handleSend"
          >
            发送
          </n-button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

const props = withDefaults(defineProps<{
  disabled?: boolean
}>(), {
  disabled: false,
})

const emit = defineEmits<{
  (e: 'send', text: string): void
}>()

const inputText = ref('')
const internetEnabled = ref(false)
const knowledgeBase = ref('default')
const internetLabel = computed(() => (internetEnabled.value ? '▼' : '▼'))
const knowledgeLabel = computed(() => '▼')

const internetOptions = [
  { label: '不联网', key: 'off' },
  { label: '自动联网', key: 'auto' },
  { label: '深度搜索', key: 'deep' },
]

const knowledgeOptions = [
  { label: '默认知识库', key: 'default' },
  { label: '营销知识库', key: 'marketing' },
  { label: '视频创作知识库', key: 'video' },
]

function handleInternetSelect(key: string) {
  internetEnabled.value = key !== 'off'
}

function handleKnowledgeSelect(key: string) {
  knowledgeBase.value = key
}

function handleSend() {
  if (!inputText.value.trim() || props.disabled) return
  emit('send', inputText.value.trim())
  inputText.value = ''
}
</script>

<style scoped>
.chat-input-area {
  padding: 16px 24px;
  border-top: 1px solid #e8ecf1;
  background: #fff;
}

.input-wrapper {
  max-width: 800px;
  margin: 0 auto;
}

.input-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 8px;
}

.toolbar-left {
  display: flex;
  gap: 4px;
}

.tool-btn {
  font-size: 13px;
  color: #666;
}

.toolbar-right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.word-count {
  font-size: 12px;
  color: #bbb;
}
</style>
