const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
require('dotenv').config()

const app = express()
app.use(cors())
app.use(express.json())

const PORT = process.env.PORT || 5000

// Connect to MongoDB
async function main() {
  try {
    await mongoose.connect(process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/quiz-app')
    console.log('Connected to MongoDB')
  } catch (err) {
    console.error('MongoDB connection error:', err)
    process.exit(1)
  }
}
main()

// Mongoose connection event listeners to provide clearer server logs about DB state
mongoose.connection.on('connected', () => console.log('Mongoose event: connected'))
mongoose.connection.on('error', (err) => console.error('Mongoose event: error', err))
mongoose.connection.on('disconnected', () => console.log('Mongoose event: disconnected'))

// Schemas
const OptionSchema = new mongoose.Schema({ text: String }, { _id: false })
const QuestionSchema = new mongoose.Schema({
  text: String,
  options: [OptionSchema],
  correctOptionIndex: Number
}, { _id: true })

const QuizSchema = new mongoose.Schema({
  title: String,
  description: String,
  questions: [QuestionSchema],
  createdAt: { type: Date, default: Date.now }
})

const Quiz = mongoose.model('Quiz', QuizSchema)

// Simple admin auth middleware using env vars (for demo only)
function adminAuth(req, res, next) {
  const user = req.headers['x-admin-user']
  const pass = req.headers['x-admin-pass']
  if (user === process.env.ADMIN_USER && pass === process.env.ADMIN_PASS) {
    next()
  } else {
    res.status(401).json({ message: 'Unauthorized' })
  }
}

// Routes
app.get('/api/quizzes', async (req, res) => {
  const quizzes = await Quiz.find({}, '-questions.correctOptionIndex').lean() // don't send correct index to the client list
  res.json(quizzes)
})

// Health check
app.get('/api/ping', (req, res) => res.json({ ok: true, time: new Date() }))

// DB Health check - returns mongoose connection state (0 disconnected, 1 connected, 2 connecting, 3 disconnecting)
app.get('/api/db-health', (req, res) => {
  const state = mongoose.connection.readyState
  const states = { 0: 'disconnected', 1: 'connected', 2: 'connecting', 3: 'disconnecting' }
  res.json({ ok: true, state, status: states[state] || 'unknown' })
})

app.get('/api/quizzes/:id', async (req, res) => {
  const quiz = await Quiz.findById(req.params.id).lean()
  if (!quiz) return res.status(404).json({ message: 'Quiz not found' })
  res.json(quiz)
})

app.post('/api/admin/login', (req, res) => {
  const { username, password } = req.body
  if (username === process.env.ADMIN_USER && password === process.env.ADMIN_PASS) {
    res.json({ ok: true })
  } else {
    res.status(401).json({ ok: false, message: 'Invalid credentials' })
  }
})

app.post('/api/admin/quizzes', adminAuth, async (req, res) => {
  const { title, description, questions } = req.body
  if (!title || !questions || !Array.isArray(questions)) {
    return res.status(400).json({ message: 'Invalid payload' })
  }
  const quiz = new Quiz({ title, description, questions })
  await quiz.save()
  res.json({ ok: true, quiz })
})

// ADMIN-only endpoints
app.get('/api/admin/quizzes', adminAuth, async (req, res) => {
  const quizzes = await Quiz.find({}).lean()
  res.json(quizzes)
})

app.put('/api/admin/quizzes/:id', adminAuth, async (req, res) => {
  try {
    const { title, description, questions } = req.body
    if (!title || !questions || !Array.isArray(questions)) return res.status(400).json({ message: 'Invalid payload' })
    const updated = await Quiz.findByIdAndUpdate(req.params.id, { title, description, questions }, { new: true })
    if (!updated) return res.status(404).json({ message: 'Quiz not found' })
    res.json({ ok: true, quiz: updated })
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message })
  }
})

app.delete('/api/admin/quizzes/:id', adminAuth, async (req, res) => {
  try {
    const removed = await Quiz.findByIdAndDelete(req.params.id)
    if (!removed) return res.status(404).json({ message: 'Quiz not found' })
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ ok: false, message: err.message })
  }
})

app.listen(PORT, () => console.log(`Server listening ${PORT}`))
