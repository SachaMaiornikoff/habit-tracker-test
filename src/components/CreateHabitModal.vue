<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import api, { updateHabit, type Habit } from '@/services/api'

const props = defineProps<{
  habit?: Habit
}>()

const emit = defineEmits<{
  close: []
  created: []
  updated: []
}>()

const isEditMode = computed(() => !!props.habit)

const title = ref('')
const weeklyTarget = ref(3)
const color = ref('#4A90D9')
const isLoading = ref(false)
const error = ref('')

onMounted(() => {
  if (props.habit) {
    title.value = props.habit.title
    weeklyTarget.value = props.habit.weeklyTarget
    color.value = props.habit.color
  }
})

const presetColors = [
  '#4A90D9',
  '#7B68EE',
  '#E74C3C',
  '#27AE60',
  '#F39C12',
  '#E91E63',
  '#00BCD4',
  '#9C27B0'
]

function selectColor(c: string) {
  color.value = c
}

async function handleSubmit() {
  error.value = ''

  if (!title.value.trim()) {
    error.value = 'Le titre est requis'
    return
  }

  if (title.value.length > 100) {
    error.value = 'Le titre ne peut pas dépasser 100 caractères'
    return
  }

  if (weeklyTarget.value < 1 || weeklyTarget.value > 7) {
    error.value = 'La cible hebdomadaire doit être entre 1 et 7'
    return
  }

  isLoading.value = true

  try {
    if (isEditMode.value && props.habit) {
      await updateHabit(props.habit.id, {
        title: title.value.trim(),
        color: color.value,
        weeklyTarget: weeklyTarget.value
      })
      emit('updated')
    } else {
      await api.post('/habits', {
        title: title.value.trim(),
        color: color.value,
        weeklyTarget: weeklyTarget.value
      })
      emit('created')
    }
    emit('close')
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } }
      const defaultError = isEditMode.value ? 'Erreur lors de la modification' : 'Erreur lors de la création'
      error.value = axiosError.response?.data?.error?.message || defaultError
    } else {
      error.value = isEditMode.value ? 'Erreur lors de la modification' : 'Erreur lors de la création'
    }
  } finally {
    isLoading.value = false
  }
}

function handleOverlayClick(event: MouseEvent) {
  if (event.target === event.currentTarget) {
    emit('close')
  }
}
</script>

<template>
  <div class="modal-overlay" @click="handleOverlayClick">
    <div class="modal-content">
      <div class="modal-header">
        <h2>{{ isEditMode ? 'Modifier l\'habitude' : 'Nouvelle habitude' }}</h2>
        <button class="close-button" @click="emit('close')" aria-label="Fermer">
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="title">Titre</label>
          <input
            id="title"
            v-model="title"
            type="text"
            placeholder="Ex: Faire du sport"
            maxlength="100"
          />
        </div>

        <div class="form-group">
          <label for="weeklyTarget">Objectif hebdomadaire</label>
          <div class="target-selector">
            <button
              type="button"
              class="target-btn"
              :disabled="weeklyTarget <= 1"
              @click="weeklyTarget--"
            >
              -
            </button>
            <span class="target-value">{{ weeklyTarget }}x / semaine</span>
            <button
              type="button"
              class="target-btn"
              :disabled="weeklyTarget >= 7"
              @click="weeklyTarget++"
            >
              +
            </button>
          </div>
        </div>

        <div class="form-group">
          <label>Couleur</label>
          <div class="color-picker">
            <div class="preset-colors">
              <button
                v-for="c in presetColors"
                :key="c"
                type="button"
                class="color-option"
                :class="{ selected: color === c }"
                :style="{ background: c }"
                @click="selectColor(c)"
                :aria-label="`Couleur ${c}`"
              ></button>
            </div>
            <div class="custom-color">
              <label for="customColor">Personnalisée:</label>
              <input
                id="customColor"
                v-model="color"
                type="color"
                class="color-input"
              />
            </div>
          </div>
        </div>

        <p v-if="error" class="error-message">{{ error }}</p>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="emit('close')">
            Annuler
          </button>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? (isEditMode ? 'Modification...' : 'Création...') : (isEditMode ? 'Modifier' : 'Créer') }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
}

.modal-content {
  background: #fff;
  border-radius: 12px;
  padding: 1.5rem;
  width: 100%;
  max-width: 420px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: #333;
}

.close-button {
  background: none;
  border: none;
  font-size: 1.5rem;
  color: #666;
  cursor: pointer;
  padding: 0;
  line-height: 1;
}

.close-button:hover {
  color: #333;
}

.form-group {
  margin-bottom: 1.25rem;
}

.form-group label {
  display: block;
  font-size: 0.9rem;
  font-weight: 500;
  color: #333;
  margin-bottom: 0.5rem;
}

.form-group input[type="text"] {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input[type="text"]:focus {
  outline: none;
  border-color: #4A90D9;
}

.target-selector {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.target-btn {
  width: 36px;
  height: 36px;
  border: 1px solid #ddd;
  border-radius: 6px;
  background: #fff;
  font-size: 1.25rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.target-btn:hover:not(:disabled) {
  background: #f5f5f5;
  border-color: #4A90D9;
}

.target-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.target-value {
  font-size: 1rem;
  font-weight: 500;
  color: #333;
  min-width: 100px;
  text-align: center;
}

.color-picker {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.preset-colors {
  display: flex;
  gap: 0.5rem;
  flex-wrap: wrap;
}

.color-option {
  width: 32px;
  height: 32px;
  border-radius: 50%;
  border: 2px solid transparent;
  cursor: pointer;
  transition: transform 0.2s;
}

.color-option:hover {
  transform: scale(1.1);
}

.color-option.selected {
  border-color: #333;
  box-shadow: 0 0 0 2px #fff inset;
}

.custom-color {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.custom-color label {
  font-size: 0.85rem;
  color: #666;
  margin: 0;
}

.color-input {
  width: 40px;
  height: 32px;
  padding: 0;
  border: 1px solid #ddd;
  border-radius: 4px;
  cursor: pointer;
}

.error-message {
  color: #e74c3c;
  font-size: 0.9rem;
  margin-bottom: 1rem;
}

.modal-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
}

.btn-cancel,
.btn-submit {
  padding: 0.75rem 1.5rem;
  border-radius: 6px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.btn-cancel {
  background: #f5f5f5;
  border: 1px solid #ddd;
  color: #666;
}

.btn-cancel:hover {
  background: #eee;
}

.btn-submit {
  background: #4A90D9;
  border: none;
  color: #fff;
}

.btn-submit:hover:not(:disabled) {
  background: #3a7bc8;
}

.btn-submit:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
