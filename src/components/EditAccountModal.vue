<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useAuthStore, ApiError } from '@/stores/auth'

const authStore = useAuthStore()

const emit = defineEmits<{
  close: []
  updated: []
}>()

const firstName = ref('')
const lastName = ref('')
const email = ref('')
const newPassword = ref('')
const confirmPassword = ref('')
const currentPassword = ref('')
const isLoading = ref(false)
const errors = ref<string[]>([])

onMounted(() => {
  if (authStore.user) {
    firstName.value = authStore.user.firstName
    lastName.value = authStore.user.lastName
    email.value = authStore.user.email
  }
})

async function handleSubmit() {
  errors.value = []

  if (!currentPassword.value) {
    errors.value = ['Le mot de passe actuel est requis']
    return
  }

  if (newPassword.value && newPassword.value !== confirmPassword.value) {
    errors.value = ['Les mots de passe ne correspondent pas']
    return
  }

  isLoading.value = true

  try {
    const updateData: {
      currentPassword: string
      email: string
      password?: string
      firstName: string
      lastName: string
    } = {
      currentPassword: currentPassword.value,
      email: email.value,
      firstName: firstName.value,
      lastName: lastName.value,
    }

    if (newPassword.value) {
      updateData.password = newPassword.value
    }

    await authStore.updateUser(updateData)
    emit('updated')
    emit('close')
  } catch (err) {
    if (err instanceof ApiError) {
      errors.value = err.messages
    } else {
      errors.value = ['Erreur lors de la mise à jour']
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
        <h2>Modifier mes informations</h2>
        <button class="close-button" @click="emit('close')" aria-label="Fermer">
          &times;
        </button>
      </div>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input
            id="firstName"
            v-model="firstName"
            type="text"
            placeholder="Prénom"
          />
        </div>

        <div class="form-group">
          <label for="lastName">Nom</label>
          <input
            id="lastName"
            v-model="lastName"
            type="text"
            placeholder="Nom"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            placeholder="Email"
          />
        </div>

        <div class="form-group">
          <label for="newPassword">Nouveau mot de passe (optionnel)</label>
          <input
            id="newPassword"
            v-model="newPassword"
            type="password"
            placeholder="Laisser vide pour ne pas changer"
          />
        </div>

        <div class="form-group" v-if="newPassword">
          <label for="confirmPassword">Confirmer le nouveau mot de passe</label>
          <input
            id="confirmPassword"
            v-model="confirmPassword"
            type="password"
            placeholder="Confirmer le mot de passe"
          />
        </div>

        <div class="form-group current-password">
          <label for="currentPassword">Mot de passe actuel *</label>
          <input
            id="currentPassword"
            v-model="currentPassword"
            type="password"
            placeholder="Requis pour confirmer les modifications"
            required
          />
        </div>

        <ul v-if="errors.length > 0" class="error-messages">
          <li v-for="error in errors" :key="error">{{ error }}</li>
        </ul>

        <div class="modal-actions">
          <button type="button" class="btn-cancel" @click="emit('close')">
            Annuler
          </button>
          <button type="submit" class="btn-submit" :disabled="isLoading">
            {{ isLoading ? 'Enregistrement...' : 'Enregistrer' }}
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
  max-height: 90vh;
  overflow-y: auto;
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

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 6px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4A90D9;
  box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.2);
}

.current-password {
  margin-top: 1.5rem;
  padding-top: 1.5rem;
  border-top: 1px solid #eee;
}

.error-messages {
  color: #e74c3c;
  font-size: 0.9rem;
  margin: 0 0 1rem 0;
  padding-left: 1.25rem;
}

.error-messages li {
  margin-bottom: 0.25rem;
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
