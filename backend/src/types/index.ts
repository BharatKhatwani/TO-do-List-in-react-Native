import type { Document } from 'mongoose'

// Todo Interface
export interface ITodo extends Document {
  text: string
  description: string
  completed: boolean
  createdAt: Date
  updatedAt: Date
}