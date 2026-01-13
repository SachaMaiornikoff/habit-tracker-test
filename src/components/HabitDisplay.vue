<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import type { HabitValidation } from '@/types/habit'
import { getHabitEntries, updateHabitEntry, getHabitStreak } from '@/services/api'

const props = defineProps<{
  habitId: string
  color: string
  name: string
}>()

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// State
const weekOffset = ref(0)
const validations = ref<HabitValidation[]>([])
const isLoading = ref(true)
const updateError = ref<string | null>(null)
const streak = ref<number | null>(null)

// Calcule le lundi de la semaine courante
function getMondayOfCurrentWeek(): Date {
  const today = new Date()
  const dayOfWeek = today.getDay()
  const mondayOffset = dayOfWeek === 0 ? -6 : 1 - dayOfWeek
  const monday = new Date(today)
  monday.setDate(today.getDate() + mondayOffset)
  monday.setHours(0, 0, 0, 0)
  return monday
}

// Formate une date en YYYY-MM-DD en utilisant l'heure locale (pas UTC)
function formatDateLocal(date: Date): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const currentWeekDates = computed(() => {
  const monday = getMondayOfCurrentWeek()
  monday.setDate(monday.getDate() + weekOffset.value * 7)

  const dates: { date: string; dayName: string }[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push({
      date: formatDateLocal(date),
      dayName: weekDays[i]
    })
  }
  return dates
})

const weekLabel = computed(() => {
  if (currentWeekDates.value.length === 0) return ''
  const start = new Date(currentWeekDates.value[0].date)
  const end = new Date(currentWeekDates.value[6].date)

  const formatDate = (d: Date) => {
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'short' })
  }

  return `${formatDate(start)} - ${formatDate(end)}`
})

const validationMap = computed(() => {
  const map = new Map<string, boolean>()
  validations.value.forEach(v => map.set(v.date, v.completed))
  return map
})

function isCompleted(date: string): boolean {
  return validationMap.value.get(date) ?? false
}

function getDayNumber(date: string): number {
  return new Date(date).getDate()
}

async function fetchWeekEntries() {
  isLoading.value = true
  updateError.value = null

  const startDate = currentWeekDates.value[0].date
  const endDate = currentWeekDates.value[6].date

  try {
    const entries = await getHabitEntries(props.habitId, startDate, endDate)
    // Si une date est présente dans le tableau retourné, c'est qu'elle est complétée
    validations.value = entries.map(entry => ({
      date: entry.date,
      completed: true
    }))
  } catch {
    // 401 errors are handled by the API interceptor (redirect to login)
    // For other errors, we keep the current state
  } finally {
    isLoading.value = false
  }
}

async function toggleValidation(date: string) {
  const currentCompleted = isCompleted(date)
  const newCompleted = !currentCompleted

  // Optimistic update
  const existingIndex = validations.value.findIndex(v => v.date === date)
  if (existingIndex !== -1) {
    validations.value[existingIndex].completed = newCompleted
  } else {
    validations.value.push({ date, completed: newCompleted })
  }

  try {
    await updateHabitEntry(props.habitId, date, newCompleted)
    updateError.value = null
  } catch {
    // 401 errors are handled by the API interceptor (redirect to login)
    // Revert optimistic update and show error for other errors
    if (existingIndex !== -1) {
      validations.value[existingIndex].completed = currentCompleted
    } else {
      validations.value = validations.value.filter(v => v.date !== date)
    }
    updateError.value = 'Veuillez recharger la page'
  }
}

function isToday(date: string): boolean {
  return date === new Date().toISOString().split('T')[0]
}

function previousWeek() {
  weekOffset.value--
}

function nextWeek() {
  weekOffset.value++
}

// Fetch entries when week changes
watch(weekOffset, () => {
  fetchWeekEntries()
})

async function fetchStreak() {
  try {
    streak.value = await getHabitStreak(props.habitId)
  } catch {
    // Silently fail - streak is non-critical
    streak.value = null
  }
}

// Initial fetch on mount
onMounted(() => {
  fetchWeekEntries()
  fetchStreak()
})
</script>

<template>
  <div class="habit-display" :style="{ '--habit-color': color }">
    <div class="habit-header">
      <div class="habit-title-row">
        <span class="habit-name">{{ name }}</span>
        <span v-if="streak !== null && streak > 0" class="streak-badge">
          🔥 {{ streak }} sem.
        </span>
      </div>
      <span v-if="!isLoading" class="week-label">{{ weekLabel }}</span>
      <span v-else class="skeleton-week-label"></span>
    </div>
    <div v-if="updateError" class="error-message">
      {{ updateError }}
    </div>
    <!-- Skeleton pour la partie semaine -->
    <div v-if="isLoading" class="habit-content">
      <div class="skeleton-arrow"></div>
      <div class="habit-days">
        <div v-for="i in 7" :key="i" class="day-item">
          <div class="skeleton-day-label"></div>
          <div class="skeleton-checkbox"></div>
        </div>
      </div>
      <div class="skeleton-arrow"></div>
    </div>
    <!-- Contenu réel -->
    <div v-else class="habit-content">
      <button class="nav-arrow" @click="previousWeek" aria-label="Semaine précédente">
        ‹
      </button>
      <div class="habit-days">
        <div
          v-for="day in currentWeekDates"
          :key="day.date"
          class="day-item"
          :class="{ today: isToday(day.date) }"
        >
          <span class="day-label">{{ day.dayName }}</span>
          <button
            class="day-checkbox"
            :class="{ completed: isCompleted(day.date) }"
            @click="toggleValidation(day.date)"
            :aria-label="`${day.dayName} ${getDayNumber(day.date)} - ${isCompleted(day.date) ? 'Complété' : 'Non complété'}`"
          >
            <span class="day-number">{{ getDayNumber(day.date) }}</span>
            <span v-if="isCompleted(day.date)" class="check-icon">✓</span>
          </button>
        </div>
      </div>
      <button class="nav-arrow" @click="nextWeek" aria-label="Semaine suivante">
        ›
      </button>
    </div>
  </div>
</template>

<style scoped>
.habit-display {
  background: #fff;
  border-radius: 12px;
  padding: 1rem 1.25rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  border-left: 4px solid var(--habit-color);
}

.habit-header {
  margin-bottom: 0.75rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.error-message {
  background: #fef2f2;
  color: #dc2626;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  font-size: 0.85rem;
  margin-bottom: 0.75rem;
  text-align: center;
}

.habit-title-row {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.habit-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
}

.streak-badge {
  font-size: 0.8rem;
  font-weight: 600;
  color: #f59e0b;
  background: #fef3c7;
  padding: 0.15rem 0.5rem;
  border-radius: 12px;
}

.week-label {
  font-size: 0.8rem;
  color: #888;
  font-weight: 500;
}

.habit-content {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-arrow {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #888;
  cursor: pointer;
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  transition: all 0.2s ease;
  line-height: 1;
}

.nav-arrow:hover {
  background: #f0f0f0;
  color: var(--habit-color);
}

.habit-days {
  display: flex;
  gap: 0.5rem;
  justify-content: space-between;
  flex: 1;
}

.day-item {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 0.25rem;
}

.day-label {
  font-size: 0.75rem;
  color: #666;
  font-weight: 500;
}

.day-item.today .day-label {
  color: var(--habit-color);
  font-weight: 700;
}

.day-checkbox {
  width: 40px;
  height: 40px;
  border-radius: 8px;
  border: 2px solid #e0e0e0;
  background: #f9f9f9;
  cursor: pointer;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
  position: relative;
}

.day-checkbox:hover {
  border-color: var(--habit-color);
  background: #fff;
}

.day-checkbox.completed {
  background: var(--habit-color);
  border-color: var(--habit-color);
}

.day-number {
  font-size: 0.85rem;
  font-weight: 600;
  color: #555;
}

.day-checkbox.completed .day-number {
  color: #fff;
  font-size: 0.7rem;
}

.check-icon {
  position: absolute;
  bottom: 2px;
  font-size: 0.65rem;
  color: #fff;
}

.day-item.today .day-checkbox {
  border-color: var(--habit-color);
  box-shadow: 0 0 0 2px rgba(0, 0, 0, 0.05);
}

/* Skeleton styles */
.skeleton-week-label {
  width: 100px;
  height: 16px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-arrow {
  width: 24px;
  height: 32px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-day-label {
  width: 24px;
  height: 14px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 4px;
}

.skeleton-checkbox {
  width: 40px;
  height: 40px;
  background: linear-gradient(90deg, #f0f0f0 25%, #e0e0e0 50%, #f0f0f0 75%);
  background-size: 200% 100%;
  animation: shimmer 1.5s infinite;
  border-radius: 8px;
}

@keyframes shimmer {
  0% {
    background-position: 200% 0;
  }
  100% {
    background-position: -200% 0;
  }
}
</style>
