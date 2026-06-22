import mongoose from 'mongoose'
import jwt from 'jsonwebtoken'

let cached = global.mongoose
if (!cached) cached = global.mongoose = { conn: null }

const connectDB = async () => {
  if (cached.conn) return cached.conn
  cached.conn = await mongoose.connect(process.env.MONGODB_URI)
  return cached.conn
}

const RSVP = mongoose.models.RSVP || mongoose.model('RSVP', {
  name: String,
  attendance: String,
  message: String,
})

function getPath(event) {
  const p = event.path || ''
  const prefix = '/.netlify/functions/api'
  if (p.startsWith(prefix)) return p.slice(prefix.length) || '/'
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
  if (event.httpMethod === 'OPTIONS') return jsonResponse(200, {})

  const path = getPath(event)
  const method = event.httpMethod

  try {
    if (path === '/login' && method === 'POST') {
      const { username, password } = getBody(event)
      if (username === process.env.ADMIN_USERNAME && password === process.env.ADMIN_PASSWORD) {
        const token = jwt.sign({ username }, process.env.JWT_SECRET, { expiresIn: '24h' })
        return jsonResponse(200, { token })
      }
      return jsonResponse(401, { message: 'Invalid credentials' })
    }

    if (path === '/rsvp' && method === 'GET') {
      const header = event.headers?.authorization || ''
      if (!header.startsWith('Bearer ')) return jsonResponse(401, { message: 'Unauthorized' })
      try { jwt.verify(header.split(' ')[1], process.env.JWT_SECRET) }
      catch { return jsonResponse(401, { message: 'Invalid token' }) }

      await connectDB()
      const guests = await RSVP.find().sort({ createdAt: -1 })
      return jsonResponse(200, guests)
    }

    return jsonResponse(404, { message: 'Not found' })
  } catch (error) {
    return jsonResponse(500, { message: 'Server error', error: error.message })
  }
}
