<script setup lang="ts">
import { ref, onMounted } from 'vue'
import api, { type Habit } from '@/services/api'
import HabitCard from '@/components/HabitCard.vue'
import CreateHabitModal from '@/components/CreateHabitModal.vue'
import DeleteHabitModal from '@/components/DeleteHabitModal.vue'

const habits = ref<Habit[]>([])
const isLoading = ref(false)
const error = ref('')
const showCreateModal = ref(false)
const showDeleteModal = ref(false)
const habitToEdit = ref<Habit | undefined>(undefined)
const habitToDelete = ref<Habit | null>(null)

async function fetchHabits() {
  isLoading.value = true
  error.value = ''

  try {
    const response = await api.get('/habits')
    habits.value = response.data.data.habits
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } }
      error.value = axiosError.response?.data?.error?.message || 'Erreur lors du chargement des habitudes'
    } else {
      error.value = 'Erreur lors du chargement des habitudes'
    }
  } finally {
    isLoading.value = false
  }
}

function handleHabitCreated() {
  fetchHabits()
}

function handleHabitUpdated() {
  fetchHabits()
}

function handleHabitDeleted() {
  fetchHabits()
}

function openCreateModal() {
  habitToEdit.value = undefined
  showCreateModal.value = true
}

function openEditModal(habit: Habit) {
  habitToEdit.value = habit
  showCreateModal.value = true
}

function closeCreateModal() {
  showCreateModal.value = false
  habitToEdit.value = undefined
}

function openDeleteModal(habit: Habit) {
  habitToDelete.value = habit
  showDeleteModal.value = true
}

function closeDeleteModal() {
  showDeleteModal.value = false
  habitToDelete.value = null
}

onMounted(() => {
  fetchHabits()
})
</script>

<template>
  <div class="page-container">
    <h1>Paramètres</h1>

    <section class="habits-section">
      <div class="section-header">
        <h2>Mes habitudes</h2>
        <button class="btn-add" @click="openCreateModal">
          + Nouvelle habitude
        </button>
      </div>

      <p v-if="isLoading" class="loading-text">Chargement...</p>
      <p v-else-if="error" class="error-text">{{ error }}</p>
      <p v-else-if="habits.length === 0" class="empty-text">
        Aucune habitude pour le moment. Créez votre première habitude !
      </p>

      <div v-else class="habits-list">
        <HabitCard
          v-for="habit in habits"
          :key="habit.id"
          :title="habit.title"
          :color="habit.color"
          :weekly-target="habit.weeklyTarget"
          @edit="openEditModal(habit)"
          @delete="openDeleteModal(habit)"
        />
      </div>
    </section>

    <CreateHabitModal
      v-if="showCreateModal"
      :habit="habitToEdit"
      @close="closeCreateModal"
      @created="handleHabitCreated"
      @updated="handleHabitUpdated"
    />

    <DeleteHabitModal
      v-if="showDeleteModal && habitToDelete"
      :habit-id="habitToDelete.id"
      :habit-title="habitToDelete.title"
      @close="closeDeleteModal"
      @deleted="handleHabitDeleted"
    />
  </div>
</template>

<style scoped>
.page-container {
  padding: 2rem;
  max-width: 800px;
  margin: 0 auto;
}

.page-container h1 {
  color: #333;
  margin: 0 0 2rem 0;
}

.habits-section {
  background: #f9f9f9;
  border-radius: 12px;
  padding: 1.5rem;
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.section-header h2 {
  margin: 0;
  font-size: 1.1rem;
  color: #333;
}

.btn-add {
  background: #4A90D9;
  color: #fff;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-add:hover {
  background: #3a7bc8;
}

.habits-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.loading-text,
.error-text,
.empty-text {
  text-align: center;
  color: #666;
  padding: 2rem;
  margin: 0;
}

.error-text {
  color: #e74c3c;
}
</style>
