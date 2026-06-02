<template>
  <n-layout class="video-creation-layout" has-sider position="absolute">
    <!-- Left panel - Creation controls -->
    <n-layout-sider
      bordered
      :width="520"
      :native-scrollbar="false"
      class="left-controls"
    >
      <div class="controls-wrapper">
        <!-- Header -->
        <div class="creation-header">
          <n-button text @click="handleBack">
            <template #icon>
              <n-icon size="18">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M20 11H7.83l5.59-5.59L12 4l-8 8 8 8 1.41-1.41L7.83 13H20v-2z"/></svg>
              </n-icon>
            </template>
          </n-button>
          <span class="creation-title">一键大片·AI智能视频生成</span>
        </div>

        <!-- Mode Tabs -->
        <div class="mode-tabs">
          <n-button
            :type="videoStore.currentMode === 'native' ? 'primary' : 'default'"
            size="small"
            round
            @click="videoStore.setMode('native')"
          >
            原生版
          </n-button>
          <n-button
            :type="videoStore.currentMode === 'long' ? 'primary' : 'default'"
            size="small"
            round
            @click="videoStore.setMode('long')"
          >
            长视频版
          </n-button>
        </div>

        <!-- Material Upload -->
        <div class="section">
          <MaterialUploader @uploaded="handleMaterialUploaded" />
        </div>

        <!-- Creative Description -->
        <div class="section">
          <CreativeDescription @polish="handlePolish" />
        </div>

        <!-- Character List -->
        <div class="section">
          <CharacterList
            :characters="characterStore.characters"
            @create="handleCreateCharacter"
          />
        </div>

        <!-- Video Params -->
        <div class="section">
          <div class="section-title">视频参数</div>
          <VideoParams
            :params="videoStore.params"
            @update:params="handleParamsUpdate"
          />
        </div>

        <!-- Long Video Mode (conditionally shown) -->
        <div v-if="videoStore.currentMode === 'long'" class="section">
          <LongVideoMode />
        </div>

        <!-- Submit -->
        <div class="submit-section">
          <n-button
            type="primary"
            size="large"
            :loading="videoStore.isLoading"
            :disabled="videoStore.isLoading"
            @click="handleSubmit"
            class="submit-btn"
          >
            开始制作
          </n-button>
          <div class="credit-cost">
            <CreditBadge :show-label="false" />
            <span class="cost-text">预计消耗 5 额度</span>
          </div>
        </div>
      </div>
    </n-layout-sider>

    <!-- Right panel - Works Gallery -->
    <n-layout class="right-workspace">
      <n-layout-header class="workspace-header" bordered>
        <n-tabs v-model:value="videoStore.activeTab" size="small" type="line" class="workspace-tabs">
          <n-tab name="home" tab="首页" />
          <n-tab name="material" tab="形象素材库" />
          <n-tab name="task" tab="我的任务" />
          <n-tab name="works" tab="我的作品" />
        </n-tabs>
      </n-layout-header>

      <n-layout-content class="workspace-content">
        <!-- Home tab -->
        <div v-if="videoStore.activeTab === 'home'" class="tab-content">
          <WorksGallery
            :works="sampleWorks"
            @regenerate="handleRegenerate"
          />
        </div>

        <!-- Material Library tab -->
        <div v-if="videoStore.activeTab === 'material'" class="tab-content">
          <MaterialLibrary
            :materials="materialStore.materials"
            @select="handleMaterialSelect"
            @upload="handleMaterialUpload"
          />
        </div>

        <!-- Tasks tab -->
        <div v-if="videoStore.activeTab === 'task'" class="tab-content">
          <TaskList :tasks="videoStore.tasks" />
        </div>

        <!-- Works tab -->
        <div v-if="videoStore.activeTab === 'works'" class="tab-content">
          <WorksLibrary
            :works="sampleLibraryWorks"
            @preview="handlePreviewWork"
          />
        </div>
      </n-layout-content>
    </n-layout>
  </n-layout>

  <!-- Character Creator Modal -->
  <CharacterCreator ref="characterCreatorRef" />
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useVideoStore } from '@/stores/video'
import { useMaterialStore } from '@/stores/material'
import { useCharacterStore } from '@/stores/character'
import { useCreditStore } from '@/stores/credit'
import MaterialUploader from '@/components/video/MaterialUploader.vue'
import CreativeDescription from '@/components/video/CreativeDescription.vue'
import VideoParams from '@/components/video/VideoParams.vue'
import TaskList from '@/components/video/TaskList.vue'
import WorksGallery from '@/components/video/WorksGallery.vue'
import WorksLibrary from '@/components/video/WorksLibrary.vue'
import MaterialLibrary from '@/components/video/MaterialLibrary.vue'
import CharacterList from '@/components/video/CharacterList.vue'
import CharacterCreator from '@/components/video/CharacterCreator.vue'
import LongVideoMode from '@/components/video/LongVideoMode.vue'
import CreditBadge from '@/components/common/CreditBadge.vue'
import type { Material, VideoOutput } from '@/types'

const router = useRouter()
const videoStore = useVideoStore()
const materialStore = useMaterialStore()
const characterStore = useCharacterStore()
const creditStore = useCreditStore()

const characterCreatorRef = ref<InstanceType<typeof CharacterCreator> | null>(null)

// Sample works for display
const sampleWorks = ref<Array<{
  id: string
  title: string
  thumbnail: string
  duration: number
  description?: string
  model?: string
  url?: string
}>>([
  {
    id: 'work-1',
    title: '智能家居新品发布',
    thumbnail: 'https://via.placeholder.com/180x320?text=智能家居',
    duration: 60,
    description: 'AI 生成的智能家居产品推广视频',
    model: 'GPT-4o',
  },
  {
    id: 'work-2',
    title: '美妆教程精选',
    thumbnail: 'https://via.placeholder.com/180x320?text=美妆教程',
    duration: 120,
    description: '美妆产品使用教程和效果展示',
    model: 'GPT-4o',
  },
  {
    id: 'work-3',
    title: '旅游Vlog短片',
    thumbnail: 'https://via.placeholder.com/180x320?text=旅游Vlog',
    duration: 90,
    description: '旅行目的地精彩片段集锦',
    model: 'GPT-4o Mini',
  },
])

const sampleLibraryWorks = ref<Array<{
  id: string
  title: string
  thumbnail: string
  createdAt: string
  duration?: number
}>>([
  { id: 'lib-1', title: '产品推广视频', thumbnail: 'https://via.placeholder.com/150x267?text=产品', createdAt: '2026-05-28' },
  { id: 'lib-2', title: '品牌故事短片', thumbnail: 'https://via.placeholder.com/150x267?text=品牌', createdAt: '2026-05-25' },
  { id: 'lib-3', title: '节日祝福视频', thumbnail: 'https://via.placeholder.com/150x267?text=节日', createdAt: '2026-05-20' },
])

onMounted(() => {
  creditStore.fetchBalance()
  characterStore.fetchCharacters()
  materialStore.fetchMaterials()
  videoStore.fetchTasks()
  videoStore.fetchOutputs()
})

function handleBack() {
  router.push('/viral-master')
}

function handleMaterialUploaded(material: Material) {
  console.log('Material uploaded:', material.name)
}

function handlePolish(content: string) {
  console.log('Polish content:', content)
}

function handleCreateCharacter() {
  characterCreatorRef.value?.open()
}

function handleParamsUpdate(params: Record<string, any>) {
  // Params are already reactive via the store
}

async function handleSubmit() {
  try {
    await videoStore.createTask('AI 智能生成视频', [])
    window.$message?.success('任务已创建')
  } catch (error) {
    window.$message?.error('创建失败，请重试')
  }
}

function handleRegenerate(work: { id: string; title: string }) {
  console.log('Regenerate:', work.title)
}

function handleMaterialSelect(material: Material) {
  console.log('Selected material:', material.name)
}

function handleMaterialUpload() {
  // Scroll to upload area
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function handlePreviewWork(work: { id: string; title: string }) {
  console.log('Preview:', work.title)
}
</script>

<style scoped>
.video-creation-layout {
  height: 100vh;
}

.left-controls {
  background: #fff;
  overflow-y: auto;
}

.controls-wrapper {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.creation-header {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 16px;
}

.creation-title {
  font-size: 16px;
  font-weight: 600;
  color: #1a1a2e;
}

.mode-tabs {
  display: flex;
  gap: 8px;
  margin-bottom: 20px;
  background: #f5f6f7;
  padding: 4px;
  border-radius: 20px;
  width: fit-content;
}

.section {
  margin-bottom: 16px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.submit-section {
  margin-top: 12px;
  padding-top: 16px;
  border-top: 1px solid #f0f2f5;
}

.submit-btn {
  width: 100%;
  height: 44px;
  font-size: 16px;
  font-weight: 600;
}

.credit-cost {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 8px;
}

.cost-text {
  font-size: 12px;
  color: #999;
}

.right-workspace {
  display: flex;
  flex-direction: column;
}

.workspace-header {
  background: #fff;
  padding: 0 20px;
}

.workspace-tabs {
  margin: 0;
}

.workspace-content {
  background: #f5f7fa;
  overflow-y: auto;
  padding: 16px 20px;
}

.tab-content {
  min-height: 100%;
}
</style>
