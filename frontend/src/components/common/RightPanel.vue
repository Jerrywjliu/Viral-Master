<template>
  <div class="right-panel">
    <div class="panel-header">
      <slot name="header">
        <span class="panel-title">{{ title }}</span>
      </slot>
    </div>
    <div class="panel-body">
      <slot />
    </div>
    <div v-if="$slots.footer" class="panel-footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<script setup lang="ts">
withDefaults(defineProps<{
  title?: string
  width?: string
}>(), {
  title: '',
  width: '260px',
})
</script>

<style scoped>
.right-panel {
  height: 100%;
  display: flex;
  flex-direction: column;
  background: #fff;
  border-left: 1px solid #e8ecf1;
}

.panel-header {
  padding: 16px 16px 12px;
  border-bottom: 1px solid #f0f2f5;
  flex-shrink: 0;
}

.panel-title {
  font-size: 15px;
  font-weight: 600;
  color: #1a1a2e;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: 12px 16px;
}

.panel-footer {
  padding: 12px 16px;
  border-top: 1px solid #f0f2f5;
  flex-shrink: 0;
}
</style>
