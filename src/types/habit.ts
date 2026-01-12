export interface HabitValidation {
  date: string // format YYYY-MM-DD
  completed: boolean
}

export interface Habit {
  id: string
  name: string
  color: string // format hexadécimal (ex: #FF5733)
  validations: HabitValidation[]
}
