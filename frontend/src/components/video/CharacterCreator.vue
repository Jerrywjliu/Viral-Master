<template>
  <n-modal v-model:show="showModal" title="创建形象" preset="card" style="width: 480px;">
    <n-form ref="formRef" :model="formData" :rules="rules" label-placement="top">
      <n-form-item label="形象名称" path="name">
        <n-input v-model:value="formData.name" placeholder="请输入形象名称" />
      </n-form-item>

      <n-form-item label="形象头像" path="avatar">
        <n-upload
          :custom-request="handleAvatarUpload"
          :show-file-list="false"
          accept="image/*"
        >
          <div class="avatar-upload">
            <n-avatar
              v-if="formData.avatar"
              :src="formData.avatar"
              :size="80"
              round
            />
            <div v-else class="avatar-placeholder">
              <n-icon size="32" color="#bbb">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 12c2.21 0 4-1.79 4-4s-1.79-4-4-4-4 1.79-4 4 1.79 4 4 4zm0 2c-2.67 0-8 1.34-8 4v2h16v-2c0-2.66-5.33-4-8-4z"/></svg>
              </n-icon>
              <span>点击上传头像</span>
            </div>
          </div>
        </n-upload>
      </n-form-item>

      <n-form-item label="形象描述" path="description">
        <n-input
          v-model:value="formData.description"
          type="textarea"
          :rows="3"
          placeholder="简要描述该形象的特征、风格等"
        />
      </n-form-item>
    </n-form>

    <template #footer>
      <div class="modal-footer">
        <n-button @click="showModal = false">取消</n-button>
        <n-button type="primary" :loading="submitting" @click="handleSubmit">确认创建</n-button>
      </div>
    </template>
  </n-modal>
</template>

<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useCharacterStore } from '@/stores/character'
import type { FormRules, FormInst } from 'naive-ui'

const characterStore = useCharacterStore()
const showModal = ref(false)
const submitting = ref(false)
const formRef = ref<FormInst | null>(null)

const formData = reactive({
  name: '',
  avatar: '',
  description: '',
})

const rules: FormRules = {
  name: [
    { required: true, message: '请输入形象名称', trigger: 'blur' },
    { min: 1, max: 20, message: '名称长度在 1-20 个字符', trigger: 'blur' },
  ],
}

function open() {
  showModal.value = true
  formData.name = ''
  formData.avatar = ''
  formData.description = ''
}

async function handleAvatarUpload({ file }: { file: { file?: File } }) {
  if (!file.file) return
  try {
    const url = await characterStore.uploadCharacterAvatar(file.file)
    formData.avatar = url
  } catch (error) {
    console.error('上传头像失败:', error)
  }
}

async function handleSubmit() {
  await formRef.value?.validate(async (errors) => {
    if (errors) return
    submitting.value = true
    try {
      await characterStore.createCharacter({
        name: formData.name,
        avatar: formData.avatar,
        description: formData.description,
      })
      showModal.value = false
      window.$message?.success('形象创建成功')
    } catch (error) {
      console.error('创建失败:', error)
    } finally {
      submitting.value = false
    }
  })
}

defineExpose({ open })
</script>

<style scoped>
.avatar-upload {
  cursor: pointer;
}

.avatar-placeholder {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  border: 2px dashed #d0d5dd;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 11px;
  color: #999;
}

.avatar-placeholder:hover {
  border-color: #2b5cf5;
}

.modal-footer {
  display: flex;
  justify-content: flex-end;
  gap: 8px;
}
</style>
