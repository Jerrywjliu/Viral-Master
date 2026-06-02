<template>
  <n-config-provider :theme-overrides="themeOverrides" :locale="zhCN" :date-locale="dateZhCN">
    <n-message-provider>
      <n-notification-provider>
        <n-dialog-provider>
          <router-view />
        </n-dialog-provider>
      </n-notification-provider>
    </n-message-provider>
  </n-config-provider>
</template>

<script setup lang="ts">
import { zhCN, dateZhCN } from 'naive-ui'
import type { GlobalThemeOverrides } from 'naive-ui'

const themeOverrides: GlobalThemeOverrides = {
  common: {
    primaryColor: '#2b5cf5',
    primaryColorHover: '#4a74f7',
    primaryColorPressed: '#1a47d4',
    primaryColorSuppl: '#2b5cf5',
    borderRadius: '8px',
  },
  Layout: {
    color: '#f5f7fa',
    siderColor: '#ffffff',
    headerColor: '#ffffff',
  },
  Menu: {
    itemColorActive: '#eef1ff',
    itemTextColorActive: '#2b5cf5',
    itemIconColorActive: '#2b5cf5',
  },
  Card: {
    color: '#ffffff',
    borderColor: '#e8ecf1',
  },
  Button: {
    color: '#2b5cf5',
    colorHover: '#4a74f7',
    colorPrimary: '#2b5cf5',
  },
}
</script>

<style>
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html,
body {
  height: 100%;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial,
    'Noto Sans', sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji';
  font-size: 14px;
  color: #333;
  background-color: #f5f7fa;
}

#app {
  height: 100%;
}

::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: #d0d5dd;
  border-radius: 3px;
}

::-webkit-scrollbar-thumb:hover {
  background: #b0b5bd;
}
</style>
