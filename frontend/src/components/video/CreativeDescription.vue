<template>
  <div class="creative-description">
    <div class="section-header">
      <span class="section-title">创意描述</span>
      <span class="char-count">{{ content.length }}/2000</span>
    </div>

    <n-input
      v-model:value="content"
      type="textarea"
      placeholder="@引用素材，描述您的创意想法..."
      :autosize="{ minRows: 4, maxRows: 8 }"
      :maxlength="2000"
      class="desc-textarea"
    />

    <div class="desc-toolbar">
      <div class="toolbar-left">
        <n-button size="tiny" quaternary class="refer-btn" @click="handleReferMaterial">
          <template #icon>
            <n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M4 6H2v14c0 1.1.9 2 2 2h14v-2H4V6zm16-4H8c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h12c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zm-1 9h-4v4h-2v-4H9V9h4V5h2v4h4v2z"/></svg></n-icon>
          </template>
          @引用素材
        </n-button>
      </div>
      <div class="toolbar-right">
        <n-button size="tiny" tertiary type="primary" class="polish-btn" @click="handlePolish">
          <template #icon>
            <n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" width="14" height="14"><path d="M3 17.25V21h3.75L17.81 9.94l-3.75-3.75L3 17.25zM20.71 7.04c.39-.39.39-1.02 0-1.41l-2.34-2.34c-.39-.39-1.02-.39-1.41 0l-1.83 1.83 3.75 3.75 1.83-1.83z"/></svg></n-icon>
          </template>
          AI润色
        </n-button>
        <n-button size="tiny" quaternary class="clear-btn" @click="handleClear">
          清空
        </n-button>
      </div>
    </div>

    <!-- Referenced materials -->
    <div v-if="referencedMaterials.length" class="referenced-materials">
      <div class="ref-label">已引用素材:</div>
      <n-tag v-for="id in referencedMaterials" :key="id" closable @close="removeReference(id)" size="small">
        {{ getMaterialName(id) }}
      </n-tag>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMaterialStore } from '@/stores/material'

const materialStore = useMaterialStore()
const content = ref('')
const referencedMaterials = ref<string[]>([])

const emit = defineEmits<{
  (e: 'update:content', value: string): void
  (e: 'polish', content: string): void
}>()

function handleReferMaterial() {
  // Open material selection dialog (simplified)
  const lastMaterial = materialStore.materials[0]
  if (lastMaterial && !referencedMaterials.value.includes(lastMaterial.id)) {
    referencedMaterials.value.push(lastMaterial.id)
    content.value += `@${lastMaterial.name} `
  }
}

function handlePolish() {
  if (content.value.trim()) {
    emit('polish', content.value)
  }
}

function handleClear() {
  content.value = ''
  referencedMaterials.value = []
}

function removeReference(id: string) {
  referencedMaterials.value = referencedMaterials.value.filter((r) => r !== id)
}

function getMaterialName(id: string): string {
  const mat = materialStore.getMaterialById(id)
  return mat?.name || id.substring(0, 8)
}
</script>

<style scoped>
.creative-description {
  margin-bottom: 16px;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.section-title {
  font-size: 14px;
  font-weight: 600;
  color: #333;
}

.char-count {
  font-size: 12px;
  color: #bbb;
}

.desc-textarea {
  --n-border-radius: 8px;
}

.desc-toolbar {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 6px;
}

.toolbar-left,
.toolbar-right {
  display: flex;
  gap: 4px;
}

.refer-btn {
  font-size: 12px;
  color: #2b5cf5;
}

.polish-btn {
  font-size: 12px;
}

.clear-btn {
  font-size: 12px;
  color: #f44336;
}

.referenced-materials {
  display: flex;
  align-items: center;
  gap: 6px;
  margin-top: 8px;
  flex-wrap: wrap;
}

.ref-label {
  font-size: 12px;
  color: #888;
}
</style>
