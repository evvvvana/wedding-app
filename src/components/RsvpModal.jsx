import { useState } from 'react'
import { motion } from 'framer-motion'

const API_BASE = import.meta.env.VITE_API_URL || '/.netlify/functions/api'

export default function RsvpModal({ inviteId, onClose, onSubmit }) {
  const [name, setName] = useState('')
  const [attending, setAttending] = useState(null)
  const [message, setMessage] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!name.trim() || attending === null) {
      setError('Please fill in your name and select attendance.')
      return
    }

    setSubmitting(true)
    setError('')

    try {
      const res = await fetch(`${API_BASE}/rsvp`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: name.trim(),
          attending,
          message: message.trim(),
          inviteId,
        }),
      })

      if (!res.ok) {
        const data = await res.json()
        throw new Error(data.message || 'Failed to submit')
      }

      onSubmit(name.trim())
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-8 relative overflow-hidden"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose via-gold to-rose" />

        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center rounded-full 
                     bg-gray-100 hover:bg-gray-200 text-gray-400 hover:text-gray-600 transition-colors cursor-pointer"
        >
          ✕
        </button>

        <h2 className="playfair text-2xl text-charcoal text-center mb-2 mt-2">
          RSVP
        </h2>
        <p className="text-charcoal/50 text-sm text-center mb-6">
          We can't wait to celebrate with you!
        </p>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5 font-medium">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Enter your full name"
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold 
                         focus:ring-1 focus:ring-gold outline-none transition-colors bg-gray-50/50"
            />
          </div>

          <div>
            <label className="block text-sm text-charcoal/60 mb-2 font-medium">
              Will you attend?
            </label>
            <div className="flex gap-3">
              <motion.button
                type="button"
                onClick={() => setAttending(true)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm border-2 transition-all cursor-pointer
                  ${attending === true
                    ? 'bg-green-50 border-green-400 text-green-700'
                    : 'border-gray-200 text-charcoal/60 hover:border-gray-300'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Yes, I'll be there!
              </motion.button>
              <motion.button
                type="button"
                onClick={() => setAttending(false)}
                className={`flex-1 py-3 rounded-xl font-medium text-sm border-2 transition-all cursor-pointer
                  ${attending === false
                    ? 'bg-red-50 border-red-400 text-red-700'
                    : 'border-gray-200 text-charcoal/60 hover:border-gray-300'
                  }`}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                Sorry, can't make it
              </motion.button>
            </div>
          </div>

          <div>
            <label className="block text-sm text-charcoal/60 mb-1.5 font-medium">
              Message (optional)
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Write a sweet message for the couple..."
              rows={3}
              className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:border-gold 
                         focus:ring-1 focus:ring-gold outline-none transition-colors bg-gray-50/50 resize-none"
            />
          </div>

          {error && (
            <p className="text-red-500 text-sm text-center">{error}</p>
          )}

          <motion.button
            type="submit"
            disabled={submitting}
            className="w-full py-3.5 bg-gold text-white rounded-xl font-medium text-base
                       shadow-md hover:shadow-lg hover:bg-gold/90 transition-all
                       disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {submitting ? (
              <span className="flex items-center justify-center gap-2">
                <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                Submitting...
              </span>
            ) : (
              'Send RSVP'
            )}
          </motion.button>
        </form>
      </motion.div>
    </motion.div>
  )
}
