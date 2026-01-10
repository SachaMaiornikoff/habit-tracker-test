import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import api from '@/services/api'
import type { AxiosError } from 'axios'

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

interface ApiErrorResponse {
  error?: {
    message?: string
  }
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function register(credentials: RegisterCredentials): Promise<void> {
    try {
      const { data } = await api.post('/auth/register', credentials)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      throw new Error(axiosError.response?.data?.error?.message || 'Registration failed')
    }
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    try {
      const { data } = await api.post('/auth/login', credentials)
      token.value = data.token
      user.value = data.user
      localStorage.setItem('token', data.token)
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      throw new Error(axiosError.response?.data?.error?.message || 'Login failed')
    }
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

    try {
      const { data } = await api.get('/auth/me')
      user.value = data.user
    } catch (error) {
      const axiosError = error as AxiosError<ApiErrorResponse>
      logout()
      throw new Error(axiosError.response?.data?.error?.message || 'Failed to fetch user')
    }
  }

  async function initializeAuth(): Promise<void> {
    if (isInitialized.value) {
      return
    }

    if (token.value) {
      try {
        await fetchMe()
      } catch {
        // Token invalid, already logged out by fetchMe
      }
    }

    isInitialized.value = true
  }

  return {
    user,
    token,
    isAuthenticated,
    isInitialized,
    register,
    login,
    logout,
    fetchMe,
    initializeAuth,
  }
})
