import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

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

function getPath(event) {
  const p = event.path || ''
  const prefix = '/.netlify/functions/api'
  if (p.startsWith(prefix)) {
    return p.slice(prefix.length) || '/'
  }
  return p
}

function getBody(event) {
  if (!event.body) return {}
  try {
    return JSON.parse(event.isBase64Encoded
      ? Buffer.from(event.body, 'base64').toString()
      : event.body)
  } catch {
    return {}
  }
}

function jsonResponse(status, data) {
  return {
    statusCode: status,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
    },
    body: JSON.stringify(data),
  }
}

export async function handler(event) {
  if (event.httpMethod === 'OPTIONS') {
    return jsonResponse(200, {})
  }

  const path = getPath(event)
  const method = event.httpMethod

  try {
    // POST /login
    if (path === '/login' && method === 'POST') {
      const { username, password } = getBody(event)
      if (username === ADMIN_USERNAME && password === ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, JWT_SECRET, { expiresIn: '24h' })
        return jsonResponse(200, { token })
      }
      return jsonResponse(401, { message: 'Invalid credentials' })
    }

    // POST /rsvp
    if (path === '/rsvp' && method === 'POST') {
      await connectDB()
      const { name, attending, message, inviteId } = getBody(event)
      if (!name || attending === undefined) {
        return jsonResponse(400, { message: 'Name and attendance are required' })
      }
      const guest = await Guest.create({ name, attending, message, inviteId })
      return jsonResponse(201, { message: 'RSVP submitted successfully', guest })
    }

    // GET /rsvp
    if (path === '/rsvp' && method === 'GET') {
      const header = event.headers?.authorization || ''
      if (!header.startsWith('Bearer ')) {
        return jsonResponse(401, { message: 'Unauthorized' })
      }
      try {
        jwt.verify(header.split(' ')[1], JWT_SECRET)
      } catch {
        return jsonResponse(401, { message: 'Invalid token' })
      }

      await connectDB()
      const params = event.queryStringParameters || {}
      const filter = params.inviteId ? { inviteId: params.inviteId } : {}
      const guests = await Guest.find(filter).sort({ createdAt: -1 })
      return jsonResponse(200, guests)
    }

    return jsonResponse(404, { message: 'Not found' })
  } catch (error) {
    return jsonResponse(500, { message: 'Server error', error: error.message })
  }
}
