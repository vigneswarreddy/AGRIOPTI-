import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import analyze from "../../assets/home/analyze.png"

function Banner() {
  return (
    <div className='w-full px-4 md:px-8'>
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
        className='w-full rounded-[2.5rem] bg-[#fffacd] overflow-hidden flex flex-col md:flex-row items-center'
      >
        {/* ── Image Column ── */}
        <div className="w-full md:w-1/2 flex items-end justify-center pt-8 md:pt-10 px-6 md:px-0 order-2 md:order-1">
          <img
            loading="lazy"
            src={analyze}
            alt="AgriOpti farming analysis"
            className="w-[80%] sm:w-[60%] md:w-[90%] max-w-sm md:max-w-none object-contain"
          />
        </div>

        {/* ── Text Column ── */}
        <div className='w-full md:w-1/2 flex flex-col items-center md:items-start text-center md:text-left py-10 px-6 md:px-12 lg:px-16 text-[#004225] order-1 md:order-2'>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug mb-4">
            The Right Place to Learn About Farming
          </h2>
          <p className="text-sm sm:text-base lg:text-lg font-medium leading-relaxed mb-8 text-[#004225]/80 max-w-md">
            AgriOpti is the premier destination for modern agriculture solutions. We provide a dynamic learning, selling, and buying experience tailored to the needs of the new generation. We empower individuals to thrive in the ever-evolving field of farming.
          </p>
          <Link to="/dashboard">
            <motion.button
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.97 }}
              className="px-8 py-3.5 rounded-xl bg-[#00563f] text-white font-bold text-base shadow-lg hover:bg-[#004225] hover:shadow-xl transition-all duration-300"
            >
              Get Started
            </motion.button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}

export default Banner