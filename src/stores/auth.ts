import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export interface User {
  id: string
  email: string
  firstName: string
  lastName: string
  createdAt: string
}

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterCredentials {
  email: string
  password: string
  firstName: string
  lastName: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function register(credentials: RegisterCredentials): Promise<void> {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Registration failed')
    }

    const data = await response.json()
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(credentials),
    })

    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.message || 'Login failed')
    }

    const data = await response.json()
    token.value = data.token
    user.value = data.user
    localStorage.setItem('token', data.token)
  }

  function logout(): void {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  async function fetchMe(): Promise<void> {
    if (!token.value) {
      return
    }

    const response = await fetch('/api/auth/me', {
      headers: {
        Authorization: `Bearer ${token.value}`,
      },
    })

    if (!response.ok) {
      logout()
      throw new Error('Failed to fetch user')
    }

    const data = await response.json()
    user.value = data.user
  }

  return {
    user,
    token,
    isAuthenticated,
    register,
    login,
    logout,
    fetchMe,
  }
})
