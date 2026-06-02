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
          <span class="creation-title">一键大片·AI智能视频生成 - 国际版</span>
        </div>

        <!-- Mode Tabs - International -->
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
            :type="videoStore.currentMode === 'enhanced' ? 'primary' : 'default'"
            size="small"
            round
            @click="videoStore.setMode('enhanced')"
          >
            加强版
          </n-button>
          <n-button
            :type="videoStore.currentMode === 'character' ? 'primary' : 'default'"
            size="small"
            round
            @click="videoStore.setMode('character')"
          >
            创建形象
          </n-button>
        </div>

        <!-- Material Upload -->
        <div class="section">
          <MaterialUploader @uploaded="handleMaterialUploaded" />
        </div>

        <!-- Creative Description - multi language hint -->
        <div class="section">
          <CreativeDescription
            ref="descRef"
            @polish="handlePolish"
          />
          <n-alert type="info" :bordered="false" class="lang-hint">
            <template #header>
              <n-icon size="16">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c.55 0 1-.45 1-1V7h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/></svg>
              </n-icon>
            </template>
            支持多语言描述：中文、English、日本語、한국어 等
          </n-alert>
        </div>

        <!-- Character List -->
        <div class="section">
          <CharacterList
            :characters="characterStore.characters"
            @create="handleCreateCharacter"
          />
        </div>

        <!-- Video Params - International -->
        <div class="section">
          <div class="section-title">视频参数</div>
          <div class="param-row">
            <span class="param-label">平台</span>
            <n-select
              v-model:value="platform"
              :options="platformOptions"
              size="small"
              class="param-select"
              @update:value="handlePlatformChange"
            />
          </div>
          <VideoParams
            :params="videoStore.params"
            :version-options="internationalVersionOptions"
            :model-options="internationalModelOptions"
            @update:params="handleParamsUpdate"
          />
          <!-- Additional international params -->
          <div class="param-row">
            <span class="param-label">字幕语言</span>
            <n-select
              v-model:value="subtitleLang"
              :options="langOptions"
              size="small"
              class="param-select"
            />
          </div>
          <div class="param-row">
            <span class="param-label">配音语言</span>
            <n-select
              v-model:value="voiceLang"
              :options="langOptions"
              size="small"
              class="param-select"
            />
          </div>
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
            <span class="cost-text">预计消耗 8 额度</span>
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
import CreditBadge from '@/components/common/CreditBadge.vue'
import type { Material } from '@/types'

const router = useRouter()
const videoStore = useVideoStore()
const materialStore = useMaterialStore()
const characterStore = useCharacterStore()
const creditStore = useCreditStore()

const characterCreatorRef = ref<InstanceType<typeof CharacterCreator> | null>(null)
const descRef = ref<InstanceType<typeof CreativeDescription> | null>(null)

// International-specific state
const platform = ref('tiktok')
const subtitleLang = ref('zh-CN')
const voiceLang = ref('zh-CN')

const platformOptions = [
  { label: 'TikTok', value: 'tiktok' },
  { label: 'Instagram', value: 'instagram' },
  { label: 'YouTube', value: 'youtube' },
  { label: 'Facebook', value: 'facebook' },
  { label: 'X (Twitter)', value: 'x' },
]

const langOptions = [
  { label: '中文 (简体)', value: 'zh-CN' },
  { label: 'English', value: 'en' },
  { label: '日本語', value: 'ja' },
  { label: '한국어', value: 'ko' },
  { label: 'Español', value: 'es' },
  { label: 'Français', value: 'fr' },
  { label: 'Deutsch', value: 'de' },
  { label: 'Português', value: 'pt' },
]

const internationalVersionOptions = [
  { label: 'V2.0 国际版', value: 'v2.0-intl' },
  { label: 'V1.0 国际版', value: 'v1.0-intl' },
]

const internationalModelOptions = [
  { label: 'GPT-4o International', value: 'gpt-4o' },
  { label: 'Claude 3.5 Sonnet', value: 'claude-3.5-sonnet' },
  { label: 'Gemini 1.5 Pro', value: 'gemini-1.5-pro' },
]

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
    id: 'intl-work-1',
    title: 'Global Brand Launch',
    thumbnail: 'https://via.placeholder.com/180x320?text=Global',
    duration: 75,
    description: 'International brand launch video with multi-language support',
    model: 'GPT-4o International',
  },
  {
    id: 'intl-work-2',
    title: 'Travel Vlog - Tokyo',
    thumbnail: 'https://via.placeholder.com/180x320?text=Tokyo',
    duration: 150,
    description: 'Tokyo travel highlights with English subtitles',
    model: 'Claude 3.5 Sonnet',
  },
])

const sampleLibraryWorks = ref<Array<{
  id: string
  title: string
  thumbnail: string
  createdAt: string
  duration?: number
}>>([
  { id: 'intl-lib-1', title: 'International Promo', thumbnail: 'https://via.placeholder.com/150x267?text=Promo', createdAt: '2026-05-30' },
  { id: 'intl-lib-2', title: 'Product Launch EN', thumbnail: 'https://via.placeholder.com/150x267?text=Launch', createdAt: '2026-05-27' },
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

function handlePlatformChange(value: string) {
  // Update ratios based on platform
  if (value === 'tiktok' || value === 'instagram') {
    videoStore.setRatio('9:16')
  } else if (value === 'youtube') {
    videoStore.setRatio('16:9')
  }
}

async function handleSubmit() {
  try {
    await videoStore.createTask('AI 智能视频生成 (国际版)', [])
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
  font-size: 15px;
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

.lang-hint {
  margin-top: 8px;
  font-size: 12px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 10px;
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
