import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'

const API_BASE = import.meta.env.VITE_API_URL || '/api'

function getToken() {
  return localStorage.getItem('token')
}

export default function AdminDashboard() {
  const [guests, setGuests] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const navigate = useNavigate()

  useEffect(() => {
    const token = getToken()
    if (!token) {
      navigate('/admin')
      return
    }

    const fetchGuests = async () => {
      try {
        const res = await fetch(`${API_BASE}/rsvp`, {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.status === 401) {
          localStorage.removeItem('token')
          navigate('/admin')
          return
        }

        const data = await res.json()

        if (!res.ok) {
          throw new Error(data.message || 'Failed to fetch')
        }

        setGuests(data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchGuests()
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    navigate('/admin')
  }

  const attending = guests.filter((g) => g.attending).length
  const notAttending = guests.filter((g) => !g.attending).length

  if (loading) {
    return (
      <div className="min-h-screen bg-ivory flex items-center justify-center">
        <motion.div
          className="text-center"
          animate={{ opacity: [0.5, 1, 0.5] }}
          transition={{ duration: 1.5, repeat: Infinity }}
        >
          <div className="text-4xl mb-4">💒</div>
          <p className="text-charcoal/50">Loading guests...</p>
        </motion.div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-ivory">
      <header className="bg-white shadow-sm border-b border-rose/30">
        <div className="max-w-5xl mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-2xl">💒</span>
            <h1 className="playfair text-xl text-charcoal">Guest Dashboard</h1>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-charcoal/50">
              {guests.length} {guests.length === 1 ? 'guest' : 'guests'}
            </span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 text-sm text-charcoal/50 hover:text-charcoal border border-gray-200 
                         rounded-lg hover:border-gray-300 transition-colors cursor-pointer"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-rose/20 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
          >
            <p className="text-3xl font-bold text-gold">{guests.length}</p>
            <p className="text-sm text-charcoal/50 mt-1">Total Responses</p>
          </motion.div>
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-green-200/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            <p className="text-3xl font-bold text-green-600">{attending}</p>
            <p className="text-sm text-charcoal/50 mt-1">Attending</p>
          </motion.div>
          <motion.div
            className="bg-white rounded-2xl p-6 shadow-sm border border-red-200/50 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <p className="text-3xl font-bold text-red-400">{notAttending}</p>
            <p className="text-sm text-charcoal/50 mt-1">Not Attending</p>
          </motion.div>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 rounded-xl p-4 mb-6 text-sm">
            {error}
          </div>
        )}

        <motion.div
          className="bg-white rounded-2xl shadow-sm border border-rose/20 overflow-hidden"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          {guests.length === 0 ? (
            <div className="text-center py-16">
              <div className="text-5xl mb-4">📋</div>
              <p className="text-charcoal/50">No RSVPs yet</p>
              <p className="text-charcoal/30 text-sm mt-1">Guest responses will appear here</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-rose/20">
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal/50 uppercase tracking-wider">
                      Name
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal/50 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal/50 uppercase tracking-wider hidden md:table-cell">
                      Message
                    </th>
                    <th className="text-left px-6 py-4 text-sm font-medium text-charcoal/50 uppercase tracking-wider hidden sm:table-cell">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <AnimatePresence>
                    {guests.map((guest, index) => (
                      <motion.tr
                        key={guest._id}
                        className="border-b border-gray-50 hover:bg-rose-light/30 transition-colors"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                      >
                        <td className="px-6 py-4">
                          <span className="font-medium text-charcoal">{guest.name}</span>
                        </td>
                        <td className="px-6 py-4">
                          <span
                            className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium
                              ${guest.attending
                                ? 'bg-green-50 text-green-700'
                                : 'bg-red-50 text-red-600'
                              }`}
                          >
                            <span className={`w-1.5 h-1.5 rounded-full ${guest.attending ? 'bg-green-500' : 'bg-red-400'}`} />
                            {guest.attending ? 'Attending' : 'Not Attending'}
                          </span>
                        </td>
                        <td className="px-6 py-4 text-sm text-charcoal/50 hidden md:table-cell max-w-xs truncate">
                          {guest.message || '—'}
                        </td>
                        <td className="px-6 py-4 text-sm text-charcoal/40 hidden sm:table-cell whitespace-nowrap">
                          {new Date(guest.createdAt).toLocaleDateString('en-US', {
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit',
                          })}
                        </td>
                      </motion.tr>
                    ))}
                  </AnimatePresence>
                </tbody>
              </table>
            </div>
          )}
        </motion.div>
      </main>
    </div>
  )
}
