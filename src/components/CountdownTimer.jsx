import { useState, useEffect } from 'react'
import { motion } from 'framer-motion'

function getTimeLeft(target) {
  const diff = new Date(target) - new Date()
  if (diff <= 0) return { days: 0, hours: 0, minutes: 0, seconds: 0 }
  return {
    days: Math.floor(diff / (1000 * 60 * 60 * 24)),
    hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
    minutes: Math.floor((diff / (1000 * 60)) % 60),
    seconds: Math.floor((diff / 1000) % 60),
  }
}

export default function CountdownTimer({ targetDate }) {
  const [timeLeft, setTimeLeft] = useState(getTimeLeft(targetDate))

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeLeft(getTimeLeft(targetDate))
    }, 1000)
    return () => clearInterval(timer)
  }, [targetDate])

  const items = [
    { label: 'Days', value: timeLeft.days },
    { label: 'Hours', value: timeLeft.hours },
    { label: 'Minutes', value: timeLeft.minutes },
    { label: 'Seconds', value: timeLeft.seconds },
  ]

  return (
    <motion.section
      className="py-20 px-4"
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-100px' }}
      transition={{ duration: 0.8 }}
    >
      <div className="max-w-2xl mx-auto text-center">
        <h2 className="playfair text-3xl md:text-4xl text-charcoal mb-10">
          Counting Down
        </h2>
        <div className="flex justify-center gap-4 md:gap-8">
          {items.map((item) => (
            <motion.div
              key={item.label}
              className="flex flex-col items-center"
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <div className="w-20 h-20 md:w-28 md:h-28 bg-white rounded-2xl shadow-lg flex items-center justify-center mb-3 border border-gold/10">
                <span className="playfair text-3xl md:text-4xl text-gold font-bold">
                  {String(item.value).padStart(2, '0')}
                </span>
              </div>
              <span className="text-sm text-charcoal/50 uppercase tracking-wider">
                {item.label}
              </span>
            </motion.div>
          ))}
        </div>
      </div>
    </motion.section>
  )
}
