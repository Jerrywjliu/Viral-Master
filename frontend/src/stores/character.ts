import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { Character } from '@/types'
import { get, post, del, upload } from '@/api'

export const useCharacterStore = defineStore('character', () => {
  const characters = ref<Character[]>([])
  const isLoading = ref(false)

  async function fetchCharacters() {
    isLoading.value = true
    try {
      const data = await get<Character[]>('/characters')
      characters.value = data
    } catch (error) {
      console.error('获取形象列表失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  async function createCharacter(character: Omit<Character, 'id' | 'createdAt'>) {
    isLoading.value = true
    try {
      const created = await post<Character>('/characters', character)
      characters.value.unshift(created)
      return created
    } catch (error) {
      console.error('创建形象失败:', error)
      throw error
    } finally {
      isLoading.value = false
    }
  }

  async function removeCharacter(id: string) {
    try {
      await del(`/characters/${id}`)
      characters.value = characters.value.filter((c) => c.id !== id)
    } catch (error) {
      console.error('删除形象失败:', error)
    }
  }

  async function uploadCharacterAvatar(file: File): Promise<string> {
    const formData = new FormData()
    formData.append('file', file)
    const result = await upload<{ url: string }>('/characters/avatar', formData)
    return result.url
  }

  return {
    characters,
    isLoading,
    fetchCharacters,
    createCharacter,
    removeCharacter,
    uploadCharacterAvatar,
  }
})
