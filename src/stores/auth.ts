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

interface ApiErrorDetail {
  message: string
  path?: string[]
  code?: string
  [key: string]: unknown
}

interface ApiErrorResponse {
  success?: boolean
  error?: {
    message?: string
    code?: string
    details?: ApiErrorDetail[]
  }
}

export class ApiError extends Error {
  messages: string[]

  constructor(messages: string[]) {
    super(messages.join('\n'))
    this.messages = messages
    this.name = 'ApiError'
  }
}

function extractErrorMessages(error: unknown, fallbackMessage: string): string[] {
  const axiosError = error as AxiosError<ApiErrorResponse>
  const errorData = axiosError.response?.data?.error

  if (!errorData) {
    return [fallbackMessage]
  }

  // If details array exists and has messages, use them
  if (errorData.details && errorData.details.length > 0) {
    const detailMessages = errorData.details
      .map((detail) => detail.message)
      .filter((msg): msg is string => !!msg)

    if (detailMessages.length > 0) {
      return detailMessages
    }
  }

  // Otherwise, use the root message
  if (errorData.message) {
    return [errorData.message]
  }

  return [fallbackMessage]
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const token = ref<string | null>(localStorage.getItem('token'))
  const isInitialized = ref(false)

  const isAuthenticated = computed(() => !!token.value && !!user.value)

  async function register(credentials: RegisterCredentials): Promise<void> {
    try {
      const { data } = await api.post('/auth/register', credentials)
      token.value = data.data.token
      user.value = data.data.user
      localStorage.setItem('token', data.data.token)
      isInitialized.value = true
    } catch (error) {
      throw new ApiError(extractErrorMessages(error, 'Registration failed'))
    }
  }

  async function login(credentials: LoginCredentials): Promise<void> {
    try {
      const { data } = await api.post('/auth/login', credentials)
      token.value = data.data.token
      user.value = data.data.user
      localStorage.setItem('token', data.data.token)
      isInitialized.value = true
    } catch (error) {
      throw new ApiError(extractErrorMessages(error, 'Login failed'))
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
      user.value = data.data.user
    } catch (error) {
      logout()
      throw new ApiError(extractErrorMessages(error, 'Failed to fetch user'))
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
