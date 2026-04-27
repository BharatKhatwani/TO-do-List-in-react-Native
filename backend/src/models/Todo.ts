import mongoose, { Schema } from 'mongoose'
import type { ITodo } from '../types/index.js'

const TodoSchema = new Schema<ITodo>(
  {
    text: {
      type: String,
      required: true,
      trim: true
    },
    description: {
      type: String,
      default: '',
      trim: true,
      maxlength: 500
    },
    completed: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
)

export default mongoose.model<ITodo>('Todo', TodoSchema);
