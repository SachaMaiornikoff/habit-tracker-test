<script setup lang="ts">
defineProps<{
  title: string
  color: string
  weeklyTarget: number
}>()

const emit = defineEmits<{
  edit: []
  delete: []
}>()
</script>

<template>
  <div class="habit-card" :style="{ '--habit-color': color }">
    <div class="color-indicator"></div>
    <div class="habit-info">
      <span class="habit-title">{{ title }}</span>
      <span class="habit-target">{{ weeklyTarget }}x / semaine</span>
    </div>
    <div class="habit-actions">
      <button class="action-btn edit-btn" @click="emit('edit')" aria-label="Modifier">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
          <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
        </svg>
      </button>
      <button class="action-btn delete-btn" @click="emit('delete')" aria-label="Supprimer">
        <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="3 6 5 6 21 6"></polyline>
          <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
          <line x1="10" y1="11" x2="10" y2="17"></line>
          <line x1="14" y1="11" x2="14" y2="17"></line>
        </svg>
      </button>
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
  flex: 1;
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

.habit-actions {
  display: flex;
  gap: 0.5rem;
}

.action-btn {
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 6px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: background 0.2s, color 0.2s;
}

.edit-btn {
  color: #666;
}

.edit-btn:hover {
  background: #f0f0f0;
  color: #4A90D9;
}

.delete-btn {
  color: #666;
}

.delete-btn:hover {
  background: #fef2f2;
  color: #e74c3c;
}
</style>
