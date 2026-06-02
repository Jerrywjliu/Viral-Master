import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import type { CreditInfo } from '@/types'
import { get } from '@/api'

export const useCreditStore = defineStore('credit', () => {
  const balance = ref(0)
  const totalUsed = ref(0)
  const totalRecharged = ref(0)
  const isLoading = ref(false)

  const creditInfo = computed<CreditInfo>(() => ({
    balance: balance.value,
    totalUsed: totalUsed.value,
    totalRecharged: totalRecharged.value,
    tasks: [],
  }))

  const isLowCredit = computed(() => balance.value < 10)

  async function fetchBalance() {
    isLoading.value = true
    try {
      const data = await get<CreditInfo>('/credit/balance')
      balance.value = data.balance
      totalUsed.value = data.totalUsed
      totalRecharged.value = data.totalRecharged
    } catch (error) {
      console.error('获取额度失败:', error)
    } finally {
      isLoading.value = false
    }
  }

  function deduct(amount: number) {
    if (balance.value >= amount) {
      balance.value -= amount
    }
  }

  function recharge(amount: number) {
    balance.value += amount
    totalRecharged.value += amount
  }

  function formatBalance(bal: number): string {
    if (bal >= 10000) {
      return (bal / 10000).toFixed(1) + '万'
    }
    return bal.toLocaleString()
  }

  return {
    balance,
    totalUsed,
    totalRecharged,
    isLoading,
    creditInfo,
    isLowCredit,
    fetchBalance,
    deduct,
    recharge,
    formatBalance,
  }
})
