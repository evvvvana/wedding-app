import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'

const API_BASE = import.meta.env.VITE_API_URL || '/.netlify/functions/api'

export default function AdminLogin() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const navigate = useNavigate()

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password }),
      })

      const data = await res.json()

      if (!res.ok) {
        throw new Error(data.message || 'Login failed')
      }

      localStorage.setItem('token', data.token)
      navigate('/admin/dashboard')
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-ivory flex items-center justify-center p-4">
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-sm w-full p-8"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <div className="text-center mb-8">
          <div className="text-4xl mb-3">💒</div>
          <h1 className="playfair text-2xl text-charcoal">Admin Login</h1>
          <p className="text-charcoal/50 text-sm mt-1">Sign in to view guest responses</p>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5 font-medium">Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold 
                         focus:ring-1 focus:ring-gold outline-none transition-colors bg-gray-50/50"
              placeholder="Enter username"
            />
          </div>

          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5 font-medium">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold 
                         focus:ring-1 focus:ring-gold outline-none transition-colors bg-gray-50/50"
              placeholder="Enter password"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={loading}
            className="w-full py-3.5 bg-gold text-white rounded-xl font-medium
                       shadow-md hover:shadow-lg hover:bg-gold/90 transition-all
                       disabled:opacity-50 cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Signing in...' : 'Sign In'}
          </motion.button>
        </form>
      </motion.div>
    </div>
  )
}
