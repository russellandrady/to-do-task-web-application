export interface TaskBase {
  title: string
  description: string
}

export interface Task extends TaskBase{
  id: number
  completed: boolean
}