<template>
  <div class="material-uploader">
    <n-upload
      :multiple="true"
      accept="video/*,image/*,audio/*"
      :max="20"
      :custom-request="handleCustomUpload"
      :show-file-list="false"
      :disabled="uploading"
    >
      <n-upload-dragger>
        <div class="upload-placeholder">
          <n-icon size="48" color="#2b5cf5">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M9 16h6v-6h4l-7-7-7 7h4zm-4 2h14v2H5z"/></svg>
          </n-icon>
          <p class="upload-text">点击或拖拽素材到此处上传</p>
          <p class="upload-hint">支持 MP4、MOV、PNG、JPG、MP3 等格式，单文件最大 500MB</p>
        </div>
      </n-upload-dragger>
    </n-upload>

    <!-- Upload progress -->
    <n-progress
      v-if="uploading"
      type="line"
      :percentage="uploadProgress"
      :height="4"
      :indicator-placement="'inside'"
      class="upload-progress"
    />

    <!-- Recently used materials -->
    <div class="recent-materials">
      <div class="section-label">最近使用素材</div>
      <div class="material-tags">
        <n-tag
          v-for="mat in recentMaterials"
          :key="mat.id"
          closable
          @close="handleRemove(mat.id)"
          class="material-tag"
        >
          <template #icon>
            <n-icon size="14">
              <svg v-if="mat.type === 'video'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4z"/></svg>
              <svg v-else-if="mat.type === 'image'" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"/></svg>
              <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/></svg>
            </n-icon>
          </template>
          {{ mat.name }}
        </n-tag>
      </div>
    </div>

    <!-- Example material card -->
    <n-card class="example-card" size="small">
      <div class="example-card-content">
        <n-icon size="20" color="#f59e0b">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>
        </n-icon>
        <div class="example-text">
          <div class="example-title">Nano Banana</div>
          <div class="example-desc">示例素材 - 点击上传替换</div>
        </div>
      </div>
    </n-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useMaterialStore } from '@/stores/material'
import type { UploadCustomRequestOptions } from 'naive-ui'
import type { Material } from '@/types'

const materialStore = useMaterialStore()
const uploading = ref(false)
const uploadProgress = ref(0)

const emit = defineEmits<{
  (e: 'uploaded', material: Material): void
  (e: 'removed', id: string): void
}>()

const recentMaterials = ref<Material[]>(materialStore.materials.slice(0, 10))

async function handleCustomUpload({ file }: UploadCustomRequestOptions) {
  if (!file.file) return
  uploading.value = true
  uploadProgress.value = 0
  try {
    const material = await materialStore.uploadMaterial(file.file, (percent) => {
      uploadProgress.value = percent
    })
    recentMaterials.value.unshift(material)
    emit('uploaded', material)
  } catch (error) {
    console.error('上传失败:', error)
  } finally {
    uploading.value = false
    uploadProgress.value = 0
  }
}

function handleRemove(id: string) {
  recentMaterials.value = recentMaterials.value.filter((m) => m.id !== id)
  emit('removed', id)
}
</script>

<style scoped>
.material-uploader {
  margin-bottom: 16px;
}

.upload-placeholder {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 8px;
  padding: 24px;
}

.upload-text {
  font-size: 14px;
  color: #333;
  font-weight: 500;
}

.upload-hint {
  font-size: 12px;
  color: #999;
}

.upload-progress {
  margin-top: 8px;
}

.recent-materials {
  margin-top: 12px;
}

.section-label {
  font-size: 13px;
  font-weight: 500;
  color: #666;
  margin-bottom: 8px;
}

.material-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
}

.material-tag {
  max-width: 180px;
}

.example-card {
  margin-top: 12px;
  border: 1px dashed #f59e0b;
  background: #fffbeb;
}

.example-card-content {
  display: flex;
  align-items: center;
  gap: 10px;
}

.example-title {
  font-size: 14px;
  font-weight: 500;
  color: #92400e;
}

.example-desc {
  font-size: 12px;
  color: #b45309;
}
</style>
