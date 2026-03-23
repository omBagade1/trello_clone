import express from 'express'
import dotenv from 'dotenv'
import prisma from './src/lib/prisma.js'
import errorHandler from './src/middleware/globalErrorHandler.js'

dotenv.config()

const app = express()
app.use(express.json())
app.use(errorHandler)

// Test route - get all users
app.get('/users', async (req, res) => {
  const users = await prisma.user.findMany()
  res.json(users)
})

// Test route - create a user
app.post('/users', async (req, res) => {
  const { name, email } = req.body
  const user = await prisma.user.create({
    data: { name, email }
  })
  res.json(user)
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))