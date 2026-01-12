import axios, { type AxiosInstance, type AxiosError, type InternalAxiosRequestConfig } from 'axios'

const API_BASE_URL = 'http://localhost:3000'

const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add Authorization header
api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Don't redirect on auth routes - let the component handle the error
      const requestUrl = error.config?.url || ''
      const isAuthRoute =
        requestUrl.includes('/auth/login') ||
        requestUrl.includes('/auth/register') ||
        requestUrl.includes('/auth/me')

      if (!isAuthRoute) {
        // Clear token and redirect to login on unauthorized (session expired)
        localStorage.removeItem('token')
        window.location.href = '/login'
      }
    }
    return Promise.reject(error)
  }
)

// Habit Entries API
export interface HabitEntry {
  id: string
  habitId: string
  date: string
  completed: boolean
}

export interface GetHabitEntriesResponse {
  success: boolean
  data: {
    entries: HabitEntry[]
  }
}

export async function getHabitEntries(
  habitId: string,
  startDate: string,
  endDate: string
): Promise<HabitEntry[]> {
  const response = await api.get<GetHabitEntriesResponse>('/habit-entries', {
    params: { habitId, startDate, endDate }
  })
  return response.data.data.entries
}

export async function updateHabitEntry(
  habitId: string,
  date: string,
  completed: boolean
): Promise<void> {
  await api.put('/habit-entries', { habitId, date, completed })
}

// Habit API
export interface Habit {
  id: string
  userId: string
  title: string
  color: string
  weeklyTarget: number
  createdAt: string
  archivedAt: string | null
}

export interface UpdateHabitData {
  title?: string
  color?: string
  weeklyTarget?: number
  archivedAt?: string | null
}

export async function updateHabit(id: string, data: UpdateHabitData): Promise<Habit> {
  const response = await api.patch<{ success: boolean; data: { habit: Habit } }>(`/habits/${id}`, data)
  return response.data.data.habit
}

export async function deleteHabit(id: string): Promise<void> {
  await api.delete(`/habits/${id}`)
}

export default api
