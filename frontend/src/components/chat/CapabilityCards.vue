<template>
  <div class="capability-cards">
    <div class="cards-title">能力卡片</div>
    <div class="cards-scroll">
      <div
        v-for="card in cards"
        :key="card.id"
        class="capability-card"
        @click="handleCardClick(card)"
      >
        <div class="card-thumbnail">
          <img :src="card.thumbnail" :alt="card.name" />
        </div>
        <div class="card-info">
          <div class="card-name">{{ card.name }}</div>
          <div class="card-desc">{{ card.description }}</div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import type { CapabilityCard } from '@/types'

defineProps<{
  cards: CapabilityCard[]
}>()

const router = useRouter()

function handleCardClick(card: CapabilityCard) {
  router.push(card.route)
}
</script>

<style scoped>
.capability-cards {
  padding: 8px 24px 16px;
  background: #fff;
}

.cards-title {
  font-size: 13px;
  font-weight: 500;
  color: #888;
  margin-bottom: 10px;
}

.cards-scroll {
  display: flex;
  gap: 10px;
  overflow-x: auto;
  padding-bottom: 4px;
}

.capability-card {
  flex-shrink: 0;
  width: 140px;
  background: #f8f9fa;
  border: 1px solid #e8ecf1;
  border-radius: 10px;
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s;
}

.capability-card:hover {
  border-color: #2b5cf5;
  box-shadow: 0 2px 8px rgba(43, 92, 245, 0.12);
  transform: translateY(-1px);
}

.card-thumbnail {
  width: 100%;
  height: 80px;
  overflow: hidden;
}

.card-thumbnail img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-info {
  padding: 8px 10px;
}

.card-name {
  font-size: 13px;
  font-weight: 600;
  color: #333;
}

.card-desc {
  font-size: 11px;
  color: #999;
  margin-top: 2px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
