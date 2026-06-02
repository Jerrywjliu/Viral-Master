<template>
  <n-popover trigger="hover" placement="bottom">
    <template #trigger>
      <n-tag :type="store.isLowCredit ? 'warning' : 'success'" :bordered="false" size="small" class="credit-badge">
        <template #icon>
          <n-icon><svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg></n-icon>
        </template>
        {{ label }}
      </n-tag>
    </template>
    <div class="credit-popover">
      <div class="credit-popover-item">
        <span>当前额度</span>
        <strong :style="{ color: store.isLowCredit ? '#f59e0b' : '#10b981' }">{{ store.formatBalance(store.balance) }}</strong>
      </div>
      <div class="credit-popover-item">
        <span>已使用</span>
        <span>{{ store.formatBalance(store.totalUsed) }}</span>
      </div>
      <div class="credit-popover-item">
        <span>已充值</span>
        <span>{{ store.formatBalance(store.totalRecharged) }}</span>
      </div>
    </div>
  </n-popover>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useCreditStore } from '@/stores/credit'

const store = useCreditStore()

const props = withDefaults(defineProps<{
  showLabel?: boolean
}>(), {
  showLabel: true,
})

const label = computed(() => {
  if (!props.showLabel) return store.formatBalance(store.balance)
  return `额度: ${store.formatBalance(store.balance)}`
})
</script>

<style scoped>
.credit-badge {
  cursor: pointer;
}

.credit-popover {
  padding: 4px 0;
  min-width: 150px;
}

.credit-popover-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6px 0;
  font-size: 13px;
}

.credit-popover-item span:first-child {
  color: #888;
}

.credit-popover-item strong {
  font-size: 14px;
}
</style>
