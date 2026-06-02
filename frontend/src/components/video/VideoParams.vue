<template>
  <div class="video-params">
    <!-- Version Select -->
    <div class="param-row">
      <span class="param-label">版本</span>
      <n-select
        v-model:value="localParams.version"
        :options="versionOptions"
        size="small"
        class="param-select"
      />
    </div>

    <!-- Model Select -->
    <div class="param-row">
      <span class="param-label">模型</span>
      <n-select
        v-model:value="localParams.model"
        :options="modelOptions"
        size="small"
        class="param-select"
      />
    </div>

    <!-- Ratio Select -->
    <div class="param-row">
      <span class="param-label">比例</span>
      <n-radio-group v-model:value="localParams.ratio" size="small" class="ratio-group">
        <n-radio-button
          v-for="r in ratios"
          :key="r"
          :value="r"
          :label="r"
        />
      </n-radio-group>
    </div>

    <!-- Quantity -->
    <div class="param-row">
      <span class="param-label">生成数量</span>
      <div class="quantity-control">
        <n-button size="tiny" circle @click="decrement">−</n-button>
        <span class="quantity-value">{{ localParams.quantity }}</span>
        <n-button size="tiny" circle @click="increment">+</n-button>
        <span class="quantity-hint">条</span>
      </div>
    </div>

    <!-- Quick select options for quantity -->
    <div class="quick-quantity">
      <n-button
        v-for="q in quickOptions"
        :key="q"
        size="tiny"
        :type="localParams.quantity === q ? 'primary' : 'default'"
        @click="localParams.quantity = q"
      >
        {{ q }}条
      </n-button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { reactive, watch } from 'vue'
import type { VideoParams, VideoRatio } from '@/types'

const props = withDefaults(defineProps<{
  params?: VideoParams
  ratios?: VideoRatio[]
  versionOptions?: { label: string; value: string }[]
  modelOptions?: { label: string; value: string }[]
}>(), {
  params: () => ({
    version: 'v2.0',
    model: 'gpt-4o',
    ratio: '9:16' as VideoRatio,
    quantity: 1,
  }),
  ratios: () => ['9:16', '3:4', '1:1', '16:9'] as VideoRatio[],
  versionOptions: () => [
    { label: 'V2.0 标准版', value: 'v2.0' },
    { label: 'V1.0 基础版', value: 'v1.0' },
  ],
  modelOptions: () => [
    { label: 'GPT-4o', value: 'gpt-4o' },
    { label: 'GPT-4o Mini', value: 'gpt-4o-mini' },
    { label: 'Claude 3.5 Sonnet', value: 'claude-3.5-sonnet' },
  ],
})

const emit = defineEmits<{
  (e: 'update:params', params: VideoParams): void
}>()

const localParams = reactive<VideoParams>({ ...props.params })
const quickOptions = [1, 2, 4, 6]

watch(localParams, (val) => {
  emit('update:params', { ...val })
}, { deep: true })

function increment() {
  if (localParams.quantity < 10) localParams.quantity++
}

function decrement() {
  if (localParams.quantity > 1) localParams.quantity--
}
</script>

<style scoped>
.video-params {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.param-row {
  display: flex;
  align-items: center;
  gap: 12px;
}

.param-label {
  font-size: 13px;
  color: #666;
  min-width: 56px;
  flex-shrink: 0;
}

.param-select {
  flex: 1;
}

.ratio-group {
  display: flex;
  gap: 4px;
}

.quantity-control {
  display: flex;
  align-items: center;
  gap: 8px;
}

.quantity-value {
  font-size: 16px;
  font-weight: 600;
  color: #333;
  min-width: 24px;
  text-align: center;
}

.quantity-hint {
  font-size: 13px;
  color: #999;
}

.quick-quantity {
  display: flex;
  gap: 6px;
  margin-left: 68px;
}
</style>
