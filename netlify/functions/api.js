import express from 'express'
import cors from 'cors'
import mongoose from 'mongoose'
import serverless from 'serverless-http'
import jwt from 'jsonwebtoken'

const app = express()

app.use(cors())
app.use(express.json())

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://hibasakhri4_db_user:Wbwsw6Mld9nkPvAS@cluster0.lml0cwu.mongodb.net/wedding'
const JWT_SECRET = process.env.JWT_SECRET || 'wedding-invitation-secret-key-2026'
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin'
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'wedding2026'

let cachedDb = null

async function connectDB() {
  if (cachedDb) return
  cachedDb = await mongoose.connect(MONGODB_URI)
}

const guestSchema = new mongoose.Schema({
  name: { type: String, required: true, trim: true },
  attending: { type: Boolean, required: true },
  message: { type: String, trim: true, default: '' },
  inviteId: { type: String, default: 'default' },
}, { timestamps: true })

const Guest = mongoose.models.Guest || mongoose.model('Guest', guestSchema)

function auth(req, res, next) {
  const header = req.headers.authorization
  if (!header || !header.startsWith('Bearer ')) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
  try {
    const token = header.split(' ')[1]
    jwt.verify(token, JWT_SECRET)
    next()
  } catch {
    res.status(401).json({ message: 'Invalid token' })
  }
}

app.post('/api/rsvp', async (req, res) => {
  try {
    await connectDB()
    const { name, attending, message, inviteId } = req.body
    if (!name || attending === undefined) {
      return res.status(400).json({ message: 'Name and attendance are required' })
    }
    const guest = await Guest.create({ name, attending, message, inviteId })
    res.status(201).json({ message: 'RSVP submitted successfully', guest })
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

app.get('/api/rsvp', auth, async (req, res) => {
  try {
    await connectDB()
    const { inviteId } = req.query
    const filter = inviteId ? { inviteId } : {}
    const guests = await Guest.find(filter).sort({ createdAt: -1 })
    res.json(guests)
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message })
  }
})

app.post('/api/login', (req, res) => {
  const { username, password } = req.body
  if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
    const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' })
    return res.json({ token })
  }
  res.status(401).json({ message: 'Invalid credentials' })
})

export const handler = serverless(app)
