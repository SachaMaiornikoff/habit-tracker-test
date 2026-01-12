<script setup lang="ts">
import { ref, computed } from 'vue'
import type { Habit, HabitValidation } from '@/types/habit'

const props = defineProps<{
  color: string
  name: string
  validations: HabitValidation[]
}>()

const emit = defineEmits<{
  updateHabit: [habit: Habit]
  weekChange: [weekStart: string]
}>()

const weekDays = ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim']

// Offset en semaines par rapport à la semaine courante (0 = cette semaine, -1 = semaine dernière, etc.)
const weekOffset = ref(0)

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

const currentWeekDates = computed(() => {
  const monday = getMondayOfCurrentWeek()
  monday.setDate(monday.getDate() + weekOffset.value * 7)

  const dates: { date: string; dayName: string }[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(monday)
    date.setDate(monday.getDate() + i)
    dates.push({
      date: date.toISOString().split('T')[0],
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
  props.validations.forEach(v => map.set(v.date, v.completed))
  return map
})

function isCompleted(date: string): boolean {
  return validationMap.value.get(date) ?? false
}

function getDayNumber(date: string): number {
  return new Date(date).getDate()
}

function toggleValidation(date: string) {
  const currentCompleted = isCompleted(date)
  const updatedValidations = currentWeekDates.value.map(d => ({
    date: d.date,
    completed: d.date === date ? !currentCompleted : isCompleted(d.date)
  }))

  const habit: Habit = {
    id: '',
    name: props.name,
    color: props.color,
    validations: updatedValidations
  }

  emit('updateHabit', habit)
}

function isToday(date: string): boolean {
  return date === new Date().toISOString().split('T')[0]
}

function previousWeek() {
  weekOffset.value--
  emit('weekChange', currentWeekDates.value[0].date)
}

function nextWeek() {
  weekOffset.value++
  emit('weekChange', currentWeekDates.value[0].date)
}
</script>

<template>
  <div class="habit-display" :style="{ '--habit-color': color }">
    <div class="habit-header">
      <span class="habit-name">{{ name }}</span>
      <span class="week-label">{{ weekLabel }}</span>
    </div>
    <div class="habit-content">
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

.habit-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: #333;
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
</style>
