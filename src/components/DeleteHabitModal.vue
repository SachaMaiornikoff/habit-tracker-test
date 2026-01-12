<script setup lang="ts">
import { ref } from 'vue'
import { deleteHabit } from '@/services/api'

const props = defineProps<{
  habitId: string
  habitTitle: string
}>()

const emit = defineEmits<{
  close: []
  deleted: []
}>()

const isLoading = ref(false)
const error = ref('')

async function handleDelete() {
  isLoading.value = true
  error.value = ''

  try {
    await deleteHabit(props.habitId)
    emit('deleted')
    emit('close')
  } catch (err: unknown) {
    if (err && typeof err === 'object' && 'response' in err) {
      const axiosError = err as { response?: { data?: { error?: { message?: string } } } }
      error.value = axiosError.response?.data?.error?.message || 'Erreur lors de la suppression'
    } else {
      error.value = 'Erreur lors de la suppression'
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
        <h2>Supprimer l'habitude</h2>
        <button class="close-button" @click="emit('close')" aria-label="Fermer">
          &times;
        </button>
      </div>

      <div class="modal-body">
        <p class="warning-text">
          Voulez-vous vraiment supprimer l'habitude <strong>{{ habitTitle }}</strong> ?
        </p>
        <p class="permanent-warning">
          Cette action est définitive et ne peut pas être annulée.
        </p>
      </div>

      <p v-if="error" class="error-message">{{ error }}</p>

      <div class="modal-actions">
        <button type="button" class="btn-cancel" @click="emit('close')">
          Annuler
        </button>
        <button
          type="button"
          class="btn-delete"
          :disabled="isLoading"
          @click="handleDelete"
        >
          {{ isLoading ? 'Suppression...' : 'Supprimer' }}
        </button>
      </div>
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
  max-width: 400px;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1rem;
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

.modal-body {
  margin-bottom: 1.5rem;
}

.warning-text {
  font-size: 1rem;
  color: #333;
  margin: 0 0 0.75rem 0;
}

.permanent-warning {
  font-size: 0.9rem;
  color: #e74c3c;
  margin: 0;
  padding: 0.75rem;
  background: #fef2f2;
  border-radius: 6px;
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
.btn-delete {
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

.btn-delete {
  background: #e74c3c;
  border: none;
  color: #fff;
}

.btn-delete:hover:not(:disabled) {
  background: #c0392b;
}

.btn-delete:disabled {
  opacity: 0.7;
  cursor: not-allowed;
}
</style>
