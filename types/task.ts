export interface Task {
  id: string
  title: string
  description?: string
  category: string
  completed: boolean
  createdat: string
  priority?: "low" | "medium" | "high"
  reminderDate?: string
}
