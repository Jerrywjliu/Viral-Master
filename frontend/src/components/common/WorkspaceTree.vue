<template>
  <div class="workspace-tree">
    <n-menu
      :options="menuOptions"
      :value="activeKey"
      :collapsed="false"
      :collapsed-width="64"
      :collapsed-icon-size="20"
      @update:value="handleMenuSelect"
    />
  </div>
</template>

<script setup lang="ts">
import { computed, h } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { NIcon } from 'naive-ui'
import type { MenuOption } from 'naive-ui'
import { useChatStore } from '@/stores/chat'

const router = useRouter()
const route = useRoute()
const chatStore = useChatStore()

interface DepartmentMenuItem {
  id: string
  name: string
  icon: string
  children?: DepartmentMenuItem[]
  route?: string
}

const departments: DepartmentMenuItem[] = [
  {
    id: 'marketing-brain',
    name: '营销智脑',
    icon: '🧠',
    children: [
      { id: 'viral-master', name: '爆款大师', icon: '🔥', route: '/viral-master' },
    ],
  },
]

function renderIcon(emoji: string) {
  return () =>
    h(NIcon, null, {
      default: () => emoji,
    })
}

function buildMenuOptions(items: DepartmentMenuItem[]): MenuOption[] {
  return items.map((item) => {
    const option: MenuOption = {
      label: item.name,
      key: item.id,
      icon: renderIcon(item.icon),
    }
    if (item.children) {
      option.children = buildMenuOptions(item.children)
    }
    return option
  })
}

const menuOptions = computed<MenuOption[]>(() => buildMenuOptions(departments))

const activeKey = computed(() => {
  // Map current route to department key
  if (route.path.startsWith('/viral-master')) return 'viral-master'
  return route.path.split('/')[1] || 'viral-master'
})

function handleMenuSelect(key: string, item: MenuOption) {
  // Find the route for this key
  const findRoute = (items: DepartmentMenuItem[]): string | undefined => {
    for (const item of items) {
      if (item.id === key) return item.route
      if (item.children) {
        const found = findRoute(item.children)
        if (found) return found
      }
    }
    return undefined
  }

  const targetRoute = findRoute(departments)
  if (targetRoute) {
    chatStore.setDepartment(key)
    router.push(targetRoute)
  }
}
</script>

<style scoped>
.workspace-tree {
  padding: 8px 0;
}

:deep(.n-menu-item) {
  margin: 2px 8px;
}

:deep(.n-menu-item--active) {
  background-color: #eef1ff;
  border-radius: 8px;
}

:deep(.n-menu-item--active .n-menu-item-content) {
  color: #2b5cf5;
}
</style>
