import { motion } from 'framer-motion'

export default function HeroSection({ invite, onRsvp }) {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-b from-rose-light via-ivory to-ivory">
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-10 left-10 w-32 h-32 border border-gold/20 rounded-full" />
        <div className="absolute bottom-20 right-10 w-48 h-48 border border-rose/30 rounded-full" />
        <div className="absolute top-1/3 right-1/4 w-4 h-4 bg-gold/20 rounded-full" />
        <div className="absolute bottom-1/3 left-1/4 w-6 h-6 bg-rose/20 rounded-full" />
      </div>

      <div className="relative z-10 text-center px-4 max-w-2xl">
        <motion.p
          className="text-gold tracking-[0.3em] uppercase text-sm md:text-base mb-6 font-medium"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
        >
          Together with their families
        </motion.p>

        <motion.h1
          className="playfair text-5xl md:text-7xl lg:text-8xl text-charcoal mb-4 leading-tight"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4 }}
        >
          {invite.bride}
          <span className="mx-4 text-gold">❤</span>
          {invite.groom}
        </motion.h1>

        <motion.div
          className="w-20 h-0.5 bg-gold mx-auto my-8"
          initial={{ scaleX: 0 }}
          animate={{ scaleX: 1 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        />

        <motion.p
          className="text-charcoal/60 text-lg md:text-xl mb-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 0.8 }}
        >
          {new Date(invite.date).toLocaleDateString('en-US', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric',
          })}
        </motion.p>

        <motion.p
          className="text-charcoal/50 mb-10"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 1.0 }}
        >
          {invite.location}
        </motion.p>

        <motion.button
          onClick={onRsvp}
          className="px-10 py-4 bg-gold text-white rounded-full text-lg font-medium
                     shadow-lg hover:shadow-xl hover:bg-gold/90 transition-all
                     cursor-pointer"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.97 }}
        >
          I Will Attend
        </motion.button>

        <motion.div
          className="mt-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.8 }}
        >
          <motion.div
            className="inline-block"
            animate={{ y: [0, 8, 0] }}
            transition={{ repeat: Infinity, duration: 2 }}
          >
            <svg className="w-6 h-6 text-gold/60" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 14l-7 7m0 0l-7-7m7 7V3" />
            </svg>
          </motion.div>
        </motion.div>
      </div>
    </section>
  )
}
