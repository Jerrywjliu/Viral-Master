/// <reference types="vite/client" />

declare module '*.vue' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

declare module 'vue-markdown-render' {
  import type { DefineComponent } from 'vue'
  const component: DefineComponent<Record<string, unknown>, Record<string, unknown>, unknown>
  export default component
}

interface Window {
  $message?: import('naive-ui').MessageApi
  $dialog?: import('naive-ui').DialogApi
  $notification?: import('naive-ui').NotificationApi
}

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string
  readonly VITE_APP_TITLE: string
  readonly VITE_SSE_URL: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
