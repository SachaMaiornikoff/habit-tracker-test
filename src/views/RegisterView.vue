<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore, ApiError } from '@/stores/auth'
import type { RegisterCredentials } from '@/stores/auth'
import { validatePassword } from '@/utils/validation'

const router = useRouter()
const authStore = useAuthStore()

const email = ref('')
const password = ref('')
const firstName = ref('')
const lastName = ref('')
const errors = ref<string[]>([])
const isLoading = ref(false)

async function handleSubmit() {
  errors.value = []

  const passwordErrors = validatePassword(password.value)
  if (passwordErrors.length > 0) {
    errors.value = passwordErrors
    return
  }

  isLoading.value = true

  const credentials: RegisterCredentials = {
    email: email.value,
    password: password.value,
    firstName: firstName.value,
    lastName: lastName.value,
  }

  try {
    await authStore.register(credentials)
    router.push('/')
  } catch (e) {
    if (e instanceof ApiError) {
      errors.value = e.messages
    } else {
      errors.value = [e instanceof Error ? e.message : 'Registration failed']
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="register-container">
    <div class="register-card">
      <h1>Inscription</h1>

      <form @submit.prevent="handleSubmit">
        <div class="form-group">
          <label for="firstName">Prénom</label>
          <input
            id="firstName"
            v-model="firstName"
            type="text"
            required
            placeholder="Entrez votre prénom"
          />
        </div>

        <div class="form-group">
          <label for="lastName">Nom</label>
          <input
            id="lastName"
            v-model="lastName"
            type="text"
            required
            placeholder="Entrez votre nom"
          />
        </div>

        <div class="form-group">
          <label for="email">Email</label>
          <input
            id="email"
            v-model="email"
            type="email"
            required
            placeholder="Entrez votre email"
          />
        </div>

        <div class="form-group">
          <label for="password">Mot de passe</label>
          <input
            id="password"
            v-model="password"
            type="password"
            required
            placeholder="Entrez votre mot de passe"
          />
        </div>

        <div v-if="errors.length > 0" class="error-message">
          <ul v-if="errors.length > 1">
            <li v-for="(err, index) in errors" :key="index">{{ err }}</li>
          </ul>
          <span v-else>{{ errors[0] }}</span>
        </div>

        <button type="submit" :disabled="isLoading" class="submit-btn">
          {{ isLoading ? 'Inscription...' : 'S\'inscrire' }}
        </button>
      </form>

      <p class="login-link">
        Déjà un compte ? <router-link to="/login">Se connecter</router-link>
      </p>
    </div>
  </div>
</template>

<style scoped>
.register-container {
  min-height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 1rem;
}

.register-card {
  background: #fff;
  border-radius: 8px;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
  padding: 2rem;
  width: 100%;
  max-width: 400px;
}

.register-card h1 {
  margin: 0 0 1.5rem;
  text-align: center;
  color: #333;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  margin-bottom: 0.5rem;
  color: #555;
  font-weight: 500;
}

.form-group input {
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ddd;
  border-radius: 4px;
  font-size: 1rem;
  box-sizing: border-box;
}

.form-group input:focus {
  outline: none;
  border-color: #4A90D9;
  box-shadow: 0 0 0 2px rgba(74, 144, 217, 0.25);
}

.error-message {
  background: #fee;
  color: #c00;
  padding: 0.75rem;
  border-radius: 4px;
  margin-bottom: 1rem;
  font-size: 0.875rem;
}

.error-message ul {
  margin: 0;
  padding-left: 1.25rem;
}

.error-message li {
  margin-bottom: 0.25rem;
}

.error-message li:last-child {
  margin-bottom: 0;
}

.submit-btn {
  width: 100%;
  padding: 0.75rem;
  background: #4A90D9;
  color: #fff;
  border: none;
  border-radius: 4px;
  font-size: 1rem;
  cursor: pointer;
  transition: background 0.2s;
}

.submit-btn:hover:not(:disabled) {
  background: #3a7bc8;
}

.submit-btn:disabled {
  background: #ccc;
  cursor: not-allowed;
}

.login-link {
  margin-top: 1rem;
  text-align: center;
  color: #666;
}

.login-link a {
  color: #4A90D9;
  text-decoration: none;
}

.login-link a:hover {
  text-decoration: underline;
}
</style>
