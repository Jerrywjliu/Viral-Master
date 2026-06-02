<template>
  <n-layout class="viral-master-layout" has-sider position="absolute">
    <!-- Left sidebar - Department Tree -->
    <n-layout-sider
      bordered
      :width="200"
      :native-scrollbar="false"
      class="left-sidebar"
    >
      <WorkspaceTree />
    </n-layout-sider>

    <!-- Center - Chat Area -->
    <n-layout class="center-chat">
      <n-layout-header class="chat-header" bordered>
        <div class="header-left">
          <n-avatar :size="32" color="#2b5cf5" class="header-avatar">
            <n-icon size="18">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"/></svg>
            </n-icon>
          </n-avatar>
          <span class="header-title">爆款大师</span>
        </div>
        <div class="header-center"></div>
        <div class="header-right">
          <n-button size="tiny" quaternary @click="handleNewSession">
            <template #icon>
              <n-icon>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="16" height="16"><path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/></svg>
              </n-icon>
            </template>
            新对话
          </n-button>
          <CreditBadge />
        </div>
      </n-layout-header>

      <n-layout-content class="chat-content">
        <ChatMessageList @preset="handlePreset" />
      </n-layout-content>

      <n-layout-footer class="chat-footer" bordered>
        <CapabilityCards :cards="chatStore.capabilityCards" />
        <ChatInput :disabled="chatStore.isLoading" @send="handleSend" />
      </n-layout-footer>
    </n-layout>

    <!-- Right Panel - Session History -->
    <n-layout-sider
      bordered
      :width="260"
      :native-scrollbar="false"
      class="right-sidebar"
      position="right"
    >
      <RightPanel title="对话历史">
        <div v-for="group in chatStore.sessionGroups" :key="group.title" class="session-group">
          <div class="session-group-title">{{ group.title }}</div>
          <div
            v-for="session in group.sessions"
            :key="session.id"
            class="session-item"
            :class="{ active: session.id === chatStore.currentSessionId }"
            @click="handleSessionClick(session.id)"
          >
            <div class="session-title">{{ session.title }}</div>
            <div class="session-time">{{ session.lastTime }}</div>
          </div>
        </div>

        <n-empty
          v-if="chatStore.sessionGroups.length === 0"
          description="暂无历史记录"
          :size="'small'"
          class="session-empty"
        />

        <template #footer>
          <div class="session-actions">
            <n-button size="tiny" quaternary @click="handleClearAll">
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM19 4h-3.5l-1-1h-5l-1 1H5v2h14V4z"/></svg>
                </n-icon>
              </n-icon>
              清空历史
            </n-button>
            <n-button size="tiny" quaternary>
              <template #icon>
                <n-icon>
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M12 8c-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4-1.79-4-4-4zm8.94 3c-.46-4.17-3.77-7.48-7.94-7.94V1h-2v2.06C6.83 3.52 3.52 6.83 3.06 11H1v2h2.06c.46 4.17 3.77 7.48 7.94 7.94V23h2v-2.06c4.17-.46 7.48-3.77 7.94-7.94H23v-2h-2.06zM12 19c-3.87 0-7-3.13-7-7s3.13-7 7-7 7 3.13 7 7-3.13 7-7 7z"/></svg>
                </n-icon>
              </n-icon>
              设置
            </n-button>
          </div>
        </template>
      </RightPanel>
    </n-layout-sider>
  </n-layout>
</template>

<script setup lang="ts">
import { onMounted } from 'vue'
import { useChatStore } from '@/stores/chat'
import { useCreditStore } from '@/stores/credit'
import WorkspaceTree from '@/components/common/WorkspaceTree.vue'
import RightPanel from '@/components/common/RightPanel.vue'
import CreditBadge from '@/components/common/CreditBadge.vue'
import ChatMessageList from '@/components/chat/ChatMessageList.vue'
import ChatInput from '@/components/chat/ChatInput.vue'
import CapabilityCards from '@/components/chat/CapabilityCards.vue'

const chatStore = useChatStore()
const creditStore = useCreditStore()

onMounted(() => {
  creditStore.fetchBalance()
})

function handleSend(text: string) {
  chatStore.sendMessage(text)
}

function handlePreset(text: string) {
  chatStore.sendMessage(text)
}

function handleNewSession() {
  chatStore.addSession({
    id: `session-${Date.now()}`,
    title: '新对话',
    lastTime: '刚刚',
    timestamp: Date.now(),
  })
  chatStore.clearMessages()
}

function handleSessionClick(id: string) {
  chatStore.setCurrentSession(id)
  // Load session messages (simplified)
}

function handleClearAll() {
  chatStore.sessions = []
  chatStore.clearMessages()
}
</script>

<style scoped>
.viral-master-layout {
  height: 100vh;
}

.left-sidebar {
  background: #fff;
  display: flex;
  flex-direction: column;
}

.center-chat {
  display: flex;
  flex-direction: column;
}

.chat-header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 12px 24px;
  background: #fff;
  height: 56px;
}

.header-left {
  display: flex;
  align-items: center;
  gap: 10px;
}

.header-avatar {
  border-radius: 8px;
}

.header-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.header-right {
  display: flex;
  align-items: center;
  gap: 12px;
}

.chat-content {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: #f5f7fa;
  overflow: hidden;
}

.chat-footer {
  background: #fff;
  flex-shrink: 0;
}

.right-sidebar {
  background: #fff;
}

.session-group {
  margin-bottom: 16px;
}

.session-group-title {
  font-size: 12px;
  font-weight: 500;
  color: #999;
  margin-bottom: 6px;
  padding: 0 4px;
}

.session-item {
  padding: 8px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: background 0.15s;
  margin-bottom: 2px;
}

.session-item:hover {
  background: #f5f7ff;
}

.session-item.active {
  background: #eef1ff;
}

.session-title {
  font-size: 13px;
  color: #333;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.session-time {
  font-size: 11px;
  color: #aaa;
  margin-top: 2px;
}

.session-empty {
  padding: 20px 0;
}

.session-actions {
  display: flex;
  justify-content: space-around;
}
</style>
