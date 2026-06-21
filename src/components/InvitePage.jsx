import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import HeroSection from './HeroSection.jsx'
import CountdownTimer from './CountdownTimer.jsx'
import RsvpModal from './RsvpModal.jsx'
import ThankYouModal from './ThankYouModal.jsx'

const defaultInvite = {
  id: 'default',
  bride: 'Sarah',
  groom: 'Ahmed',
  date: '2026-09-15T16:00:00',
  location: 'The Grand Ballroom, Hilton Hotel',
  address: '123 Love Street, New York, NY',
}

export default function InvitePage() {
  const { id } = useParams()
  const [showRsvp, setShowRsvp] = useState(false)
  const [showThanks, setShowThanks] = useState(false)
  const [guestName, setGuestName] = useState('')

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [])

  const handleRsvpSubmit = (name) => {
    setGuestName(name)
    setShowRsvp(false)
    setShowThanks(true)
  }

  return (
    <div className="min-h-screen bg-ivory">
      <HeroSection invite={defaultInvite} onRsvp={() => setShowRsvp(true)} />

      <motion.section
        id="details"
        className="py-20 px-4 max-w-3xl mx-auto text-center"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="playfair text-3xl md:text-4xl text-charcoal mb-6">
          We're Getting Married!
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-8" />
        <p className="text-lg text-charcoal/70 mb-4 leading-relaxed">
          With hearts full of love and joy, we invite you to celebrate our special day
          as we exchange vows and begin our journey together as husband and wife.
        </p>
      </motion.section>

      <CountdownTimer targetDate={defaultInvite.date} />

      <motion.section
        className="py-20 px-4 max-w-2xl mx-auto text-center bg-rose/30"
        initial={{ opacity: 0, y: 40 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: '-100px' }}
        transition={{ duration: 0.8 }}
      >
        <h2 className="playfair text-3xl md:text-4xl text-charcoal mb-4">
          When & Where
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-8" />
        <div className="space-y-4">
          <p className="text-xl font-medium text-charcoal">
            {new Date(defaultInvite.date).toLocaleDateString('en-US', {
              weekday: 'long',
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })}
          </p>
          <p className="text-lg text-charcoal/70">
            4:00 PM
          </p>
          <div className="w-8 h-0.5 bg-gold/50 mx-auto" />
          <p className="text-xl font-medium text-charcoal">
            {defaultInvite.location}
          </p>
          <p className="text-charcoal/60">
            {defaultInvite.address}
          </p>
        </div>
      </motion.section>

      <motion.section
        className="py-20 px-4 text-center"
        initial={{ opacity: 0, scale: 0.95 }}
        whileInView={{ opacity: 1, scale: 1 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        <h2 className="playfair text-3xl md:text-4xl text-charcoal mb-4">
          Will You Join Us?
        </h2>
        <div className="w-16 h-0.5 bg-gold mx-auto mb-8" />
        <p className="text-charcoal/70 mb-10 max-w-md mx-auto">
          Your presence is the greatest gift of all. Please let us know if you can make it.
        </p>
        <motion.button
          onClick={() => setShowRsvp(true)}
          className="px-10 py-4 bg-gold text-white rounded-full text-lg font-medium
                     shadow-lg hover:shadow-xl hover:bg-gold/90 transition-all
                     cursor-pointer"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          RSVP Now
        </motion.button>
      </motion.section>

      <footer className="py-8 text-center border-t border-rose">
        <p className="text-charcoal/40 text-sm">
          Made with love &nbsp;|&nbsp; Sarah & Ahmed
        </p>
      </footer>

      <AnimatePresence>
        {showRsvp && (
          <RsvpModal
            inviteId={id || defaultInvite.id}
            onClose={() => setShowRsvp(false)}
            onSubmit={handleRsvpSubmit}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showThanks && (
          <ThankYouModal
            guestName={guestName}
            onClose={() => setShowThanks(false)}
          />
        )}
      </AnimatePresence>
    </div>
  )
}
