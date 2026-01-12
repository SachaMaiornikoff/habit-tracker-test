<script setup lang="ts">
import { ref, onMounted } from 'vue'
import HabitDisplay from '@/components/HabitDisplay.vue'
import api from '@/services/api'

interface HabitFromAPI {
  id: string
  title: string
  color: string
  weeklyTarget: number
}

const habits = ref<HabitFromAPI[]>([])
const isLoading = ref(true)
const error = ref<string | null>(null)

async function fetchHabits() {
  isLoading.value = true
  error.value = null

  try {
    const response = await api.get('/habits')
    habits.value = response.data.data.habits
  } catch {
    // 401 errors are handled by the API interceptor (redirect to login)
    error.value = 'Erreur lors du chargement des habitudes'
  } finally {
    isLoading.value = false
  }
}

onMounted(() => {
  fetchHabits()
})
</script>

<template>
  <div class="page-container">
    <h1>Accueil</h1>
    <p v-if="isLoading" class="loading-text">Chargement...</p>
    <p v-else-if="error" class="error-text">{{ error }}</p>
    <p v-else-if="habits.length === 0" class="empty-text">
      Aucune habitude pour le moment. Créez votre première habitude dans les paramètres !
    </p>
    <div v-else class="habits-list">
      <HabitDisplay
        v-for="habit in habits"
        :key="habit.id"
        :habit-id="habit.id"
        :name="habit.title"
        :color="habit.color"
      />
    </div>
  </div>
</template>

<style scoped>
.page-container {
  padding: 2rem;
}

.page-container h1 {
  color: #333;
  margin: 0 0 1.5rem 0;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  max-width: 500px;
}

.loading-text,
.empty-text {
  color: #666;
  font-size: 1rem;
}

.error-text {
  color: #dc2626;
  font-size: 1rem;
}
</style>
