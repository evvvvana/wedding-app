import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Confetti from 'react-confetti'

export default function ThankYouModal({ guestName, onClose }) {
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight })

  useEffect(() => {
    const handle = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight })
    window.addEventListener('resize', handle)
    return () => window.removeEventListener('resize', handle)
  }, [])

  return (
    <motion.div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
    >
      <Confetti
        width={windowSize.width}
        height={windowSize.height}
        numberOfPieces={200}
        recycle={true}
        colors={['#d4af37', '#f5c6c6', '#f8e8e8', '#f0e6c8', '#c1c9b6']}
      />

      <motion.div
        className="bg-white rounded-3xl shadow-2xl max-w-md w-full p-10 relative overflow-hidden text-center"
        initial={{ scale: 0.85, opacity: 0, y: 30 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ scale: 0.85, opacity: 0, y: 30 }}
        transition={{ type: 'spring', damping: 25, stiffness: 300 }}
        onClick={(e) => e.stopPropagation()}
      >
        <div className="absolute top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-rose via-gold to-rose" />

        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200 }}
          className="text-5xl mb-6"
        >
          💕
        </motion.div>

        <h2 className="playfair text-2xl text-charcoal mb-3">
          Thank You, {guestName}!
        </h2>
        <p className="text-charcoal/60 mb-6 leading-relaxed">
          Your response has been received with love.
          We can't wait to celebrate this special day with you!
        </p>

        <motion.div
          className="flex justify-center gap-2 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
        >
          {'❤'.repeat(5).split('').map((h, i) => (
            <motion.span
              key={i}
              className="text-xl"
              animate={{ scale: [1, 1.3, 1] }}
              transition={{ delay: i * 0.15, repeat: Infinity, duration: 1.5 }}
            >
              {h}
            </motion.span>
          ))}
        </motion.div>

        <motion.button
          onClick={onClose}
          className="px-8 py-3 bg-gold text-white rounded-full font-medium
                     shadow-md hover:shadow-lg hover:bg-gold/90 transition-all cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          Close
        </motion.button>
      </motion.div>
    </motion.div>
  )
}
