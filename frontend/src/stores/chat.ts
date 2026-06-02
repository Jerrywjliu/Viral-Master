import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { ChatMessage, Session, SessionGroup, PresetQuestion, CapabilityCard } from '@/types'
import { post } from '@/api'

export const useChatStore = defineStore('chat', () => {
  // State
  const messages = ref<ChatMessage[]>([])
  const currentSessionId = ref<string>('')
  const sessions = ref<Session[]>([])
  const isLoading = ref(false)
  const currentDepartment = ref('viral-master')

  // Preset questions for the current department
  const presetQuestions = ref<PresetQuestion[]>([
    { id: '1', text: '如何快速打造一个爆款短视频？' },
    { id: '2', text: '帮我分析最近的视频趋势' },
    { id: '3', text: '如何优化视频素材才能提升完播率？' },
  ])

  // Capability cards
  const capabilityCards = ref<CapabilityCard[]>([
    {
      id: '1',
      name: '一键追爆',
      description: 'AI自动追踪热门爆款',
      thumbnail: 'https://via.placeholder.com/120x80?text=追爆',
      route: '/viral-master',
    },
    {
      id: '2',
      name: '灵感视频',
      description: 'AI创意灵感生成',
      thumbnail: 'https://via.placeholder.com/120x80?text=灵感',
      route: '/viral-master',
    },
    {
      id: '3',
      name: 'AI超级混剪',
      description: '智能素材混剪成片',
      thumbnail: 'https://via.placeholder.com/120x80?text=混剪',
      route: '/video-creation/domestic',
    },
    {
      id: '4',
      name: '一键大片国内版',
      description: '国内平台视频生成',
      thumbnail: 'https://via.placeholder.com/120x80?text=国内',
      route: '/video-creation/domestic',
    },
    {
      id: '5',
      name: '一键大片国际版',
      description: '国际平台视频生成',
      thumbnail: 'https://via.placeholder.com/120x80?text=国际',
      route: '/video-creation/international',
    },
  ])

  // Getters
  const sessionGroups = computed<SessionGroup[]>(() => {
    const now = Date.now()
    const day7 = 7 * 24 * 60 * 60 * 1000
    const day30 = 30 * 24 * 60 * 60 * 1000

    const groups: SessionGroup[] = [
      { title: '7天内', sessions: [] },
      { title: '30天内', sessions: [] },
      { title: '更早', sessions: [] },
    ]

    const sorted = [...sessions.value].sort((a, b) => b.timestamp - a.timestamp)
    for (const session of sorted) {
      const diff = now - session.timestamp
      if (diff <= day7) {
        groups[0].sessions.push(session)
      } else if (diff <= day30) {
        groups[1].sessions.push(session)
      } else {
        groups[2].sessions.push(session)
      }
    }

    return groups.filter((g) => g.sessions.length > 0)
  })

  // Actions
  function addMessage(message: ChatMessage) {
    messages.value.push(message)
  }

  function setMessages(newMessages: ChatMessage[]) {
    messages.value = newMessages
  }

  function clearMessages() {
    messages.value = []
  }

  function setCurrentSession(id: string) {
    currentSessionId.value = id
  }

  function addSession(session: Session) {
    sessions.value.unshift(session)
    currentSessionId.value = session.id
  }

  function removeSession(id: string) {
    sessions.value = sessions.value.filter((s) => s.id !== id)
    if (currentSessionId.value === id) {
      currentSessionId.value = sessions.value[0]?.id || ''
    }
  }

  async function sendMessage(content: string) {
    if (!content.trim()) return

    const userMessage: ChatMessage = {
      id: `user-${Date.now()}`,
      role: 'user',
      content: content.trim(),
      timestamp: Date.now(),
      status: 'sent',
    }
    addMessage(userMessage)
    isLoading.value = true

    try {
      const response = await post<{ reply: string }>('/chat/send', {
        sessionId: currentSessionId.value,
        message: content.trim(),
        department: currentDepartment.value,
      })

      const aiMessage: ChatMessage = {
        id: `ai-${Date.now()}`,
        role: 'assistant',
        content: response.reply,
        timestamp: Date.now(),
        status: 'sent',
      }
      addMessage(aiMessage)
    } catch (error) {
      const errorMsg: ChatMessage = {
        id: `error-${Date.now()}`,
        role: 'assistant',
        content: '抱歉，我暂时无法处理您的请求，请稍后再试。',
        timestamp: Date.now(),
        status: 'error',
      }
      addMessage(errorMsg)
    } finally {
      isLoading.value = false
    }
  }

  function setDepartment(dept: string) {
    currentDepartment.value = dept
    clearMessages()
  }

  return {
    messages,
    currentSessionId,
    sessions,
    isLoading,
    currentDepartment,
    presetQuestions,
    capabilityCards,
    sessionGroups,
    addMessage,
    setMessages,
    clearMessages,
    setCurrentSession,
    addSession,
    removeSession,
    sendMessage,
    setDepartment,
  }
})
