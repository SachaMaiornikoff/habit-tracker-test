<script setup lang="ts">
import { ref } from 'vue'
import HabitDisplay from '@/components/HabitDisplay.vue'
import type { Habit } from '@/types/habit'

// Génère les dates d'une semaine à partir du lundi
function getWeekDates(mondayDate: Date): string[] {
  const dates: string[] = []
  for (let i = 0; i < 7; i++) {
    const date = new Date(mondayDate)
    date.setDate(mondayDate.getDate() + i)
    dates.push(date.toISOString().split('T')[0])
  }
  return dates
}

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

// Génère des données mock pour plusieurs semaines
function generateMockData() {
  const currentMonday = getMondayOfCurrentWeek()

  // Génère 5 semaines de données (2 avant, courante, 2 après)
  const allValidations: Record<string, Record<string, boolean>> = {}

  for (let weekOffset = -2; weekOffset <= 2; weekOffset++) {
    const monday = new Date(currentMonday)
    monday.setDate(currentMonday.getDate() + weekOffset * 7)
    const weekDates = getWeekDates(monday)

    weekDates.forEach(date => {
      allValidations[date] = {
        '1': Math.random() > 0.4, // Méditation
        '2': Math.random() > 0.5, // Sport
        '3': Math.random() > 0.3, // Lecture
        '4': Math.random() > 0.6, // Pas de sucre
      }
    })
  }

  return allValidations
}

const mockData = generateMockData()

// Données factices pour les habitudes
const habits = ref<Habit[]>([
  {
    id: '1',
    name: 'Méditation',
    color: '#6366F1',
    validations: Object.entries(mockData).map(([date, data]) => ({
      date,
      completed: data['1']
    }))
  },
  {
    id: '2',
    name: 'Sport',
    color: '#22C55E',
    validations: Object.entries(mockData).map(([date, data]) => ({
      date,
      completed: data['2']
    }))
  },
  {
    id: '3',
    name: 'Lecture 30 min',
    color: '#F59E0B',
    validations: Object.entries(mockData).map(([date, data]) => ({
      date,
      completed: data['3']
    }))
  },
  {
    id: '4',
    name: 'Pas de sucre',
    color: '#EF4444',
    validations: Object.entries(mockData).map(([date, data]) => ({
      date,
      completed: data['4']
    }))
  }
])

function handleUpdateHabit(habitId: string, updatedHabit: Habit) {
  const index = habits.value.findIndex(h => h.id === habitId)
  if (index !== -1) {
    // Merge les nouvelles validations avec les existantes
    const existingValidations = new Map(
      habits.value[index].validations.map(v => [v.date, v.completed])
    )
    updatedHabit.validations.forEach(v => {
      existingValidations.set(v.date, v.completed)
    })

    habits.value[index] = {
      ...habits.value[index],
      validations: Array.from(existingValidations.entries()).map(([date, completed]) => ({
        date,
        completed
      }))
    }
    console.log('Habitude mise à jour:', habits.value[index])
  }
}

function handleWeekChange(habitId: string, weekStart: string) {
  // À terme, ici on fera un appel API pour récupérer les données de la semaine
  console.log(`Changement de semaine pour ${habitId}: ${weekStart}`)
}
</script>

<template>
  <div class="page-container">
    <h1>Accueil</h1>
    <div class="habits-list">
      <HabitDisplay
        v-for="habit in habits"
        :key="habit.id"
        :name="habit.name"
        :color="habit.color"
        :validations="habit.validations"
        @update-habit="(h) => handleUpdateHabit(habit.id, h)"
        @week-change="(weekStart) => handleWeekChange(habit.id, weekStart)"
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
</style>
