import express from 'express'
import type { Application } from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import todoRoutes from './routes/todos.js'

dotenv.config()

const app: Application = express()

// Middleware
app.use(cors())
app.use(express.json())

// Routes
app.use('/api/todos', todoRoutes)

// MongoDB Connection
const MONGO_URI = process.env.MONGO_URI!
const PORT = process.env.PORT || 5000

if (!MONGO_URI) {
  console.error('Missing MONGO_URI in backend/.env')
  console.error('Create backend/.env and set MONGO_URI, then restart the server.')
  process.exit(1)
}

mongoose
  .connect(MONGO_URI)
  .then(() => {
    console.log('MongoDB Connected ✅')
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT} 🚀`)
    })
  })
  .catch((err: Error) => {
    console.log('MongoDB Error:', err.message)
  })