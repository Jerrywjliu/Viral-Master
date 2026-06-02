import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { VideoTask, VideoParams, VideoOutput, VideoMode, VideoRatio } from '@/types'
import { get, post } from '@/api'

export const useVideoStore = defineStore('video', () => {
  const tasks = ref<VideoTask[]>([])
  const outputs = ref<VideoOutput[]>([])
  const currentMode = ref<VideoMode>('native')
  const params = ref<VideoParams>({
    version: 'v2.0',
    model: 'gpt-4o',
    ratio: '9:16',
    quantity: 1,
  })
  const isLoading = ref(false)
  const activeTab = ref<'home' | 'material' | 'task' | 'works'>('home')

  const activeTasks = computed(() => tasks.value.filter((t) => t.status === 'queued' || t.status === 'processing'))
  const completedTasks = computed(() => tasks.value.filter((t) => t.status === 'completed'))
  const failedTasks = computed(() => tasks.value.filter((t) => t.status === 'failed'))

  const ratioOptions = computed(() => {
    const ratios: VideoRatio[] = ['9:16', '3:4', '1:1', '16:9']
    return ratios
  })

  async function fetchTasks() {
    isLoading.value = true
    try {
      const data = await get<VideoTask[]>('/video/tasks')
      tasks.value = data
    } catch (error) {
      console.error('获取任务列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function fetchOutputs() {
    isLoading.value = true
    try {
      const data = await get<VideoOutput[]>('/video/outputs')
      outputs.value = data
    } catch (error) {
      console.error('获取作品列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function createTask(description: string, materials: string[]) {
    isLoading.value = true
    try {
      const task = await post<VideoTask>('/video/tasks', {
        mode: currentMode.value,
        params: params.value,
        description,
        materials,
      })
      tasks.value.unshift(task)
      return task
    } catch (error) {
      console.error('创建任务失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  function setMode(mode: VideoMode) {
    currentMode.value = mode
  }

  function updateParams(partial: Partial<VideoParams>) {
    Object.assign(params.value, partial)
  }

  function setRatio(ratio: VideoRatio) {
    params.value.ratio = ratio
  }

  function setActiveTab(tab: 'home' | 'material' | 'task' | 'works') {
    activeTab.value = tab
  }

  return {
    tasks,
    outputs,
    currentMode,
    params,
    isLoading,
    activeTab,
    activeTasks,
    completedTasks,
    failedTasks,
    ratioOptions,
    fetchTasks,
    fetchOutputs,
    createTask,
    setMode,
    updateParams,
    setRatio,
    setActiveTab,
  }
})
