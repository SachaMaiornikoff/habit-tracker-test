<script setup lang="ts">
defineProps<{
  title: string
  color: string
  weeklyTarget: number
}>()
</script>

<template>
  <div class="habit-card" :style="{ '--habit-color': color }">
    <div class="color-indicator"></div>
    <div class="habit-info">
      <span class="habit-title">{{ title }}</span>
      <span class="habit-target">{{ weeklyTarget }}x / semaine</span>
    </div>
  </div>
</template>

<style scoped>
.habit-card {
  display: flex;
  align-items: center;
  gap: 1rem;
  background: #fff;
  border-radius: 8px;
  padding: 1rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.color-indicator {
  width: 16px;
  height: 16px;
  border-radius: 50%;
  background: var(--habit-color);
  flex-shrink: 0;
}

.habit-info {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.habit-title {
  font-size: 1rem;
  font-weight: 600;
  color: #333;
}

.habit-target {
  font-size: 0.85rem;
  color: #666;
}
</style>
