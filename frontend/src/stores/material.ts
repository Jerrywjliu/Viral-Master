import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Material } from '@/types'
import { get, upload, del } from '@/api'

export const useMaterialStore = defineStore('material', () => {
  const materials = ref<Material[]>([])
  const isLoading = ref(false)
  const uploadProgress = ref(0)

  async function fetchMaterials() {
    isLoading.value = true
    try {
      const data = await get<Material[]>('/materials')
      materials.value = data
    } catch (error) {
      console.error('获取素材列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function uploadMaterial(file: File, onProgress?: (percent: number) => void) {
    isLoading.value = true
    uploadProgress.value = 0
    try {
      const formData = new FormData()
      formData.append('file', file)
      const material = await upload<Material>('/materials/upload', formData, {
        onUploadProgress: (progressEvent) => {
          if (progressEvent.total) {
            const percent = Math.round((progressEvent.loaded * 100) / progressEvent.total)
            uploadProgress.value = percent
            onProgress?.(percent)
          }
        },
      })
      materials.value.unshift(material)
      return material
    } catch (error) {
      console.error('上传素材失败:', error)
      throw error
    } finally {
      isLoading.value = false
      uploadProgress.value = 0
    }
  }

  async function removeMaterial(id: string) {
    try {
      await del(`/materials/${id}`)
      materials.value = materials.value.filter((m) => m.id !== id)
    } catch (error) {
      console.error('删除素材失败:', error)
    }
  }

  function getMaterialById(id: string): Material | undefined {
    return materials.value.find((m) => m.id === id)
  }

  return {
    materials,
    isLoading,
    uploadProgress,
    fetchMaterials,
    uploadMaterial,
    removeMaterial,
    getMaterialById,
  }
})
