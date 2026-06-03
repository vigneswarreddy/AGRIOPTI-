import React from 'react'
import { motion } from 'framer-motion'
import Navbar from '../Components/Navbar'
import HeroSection from '../Components/HomeComponents/HeroSection'
import DashboardPreview from '../Components/HomeComponents/DashboardPreview'
import Rating from '../Components/HomeComponents/Rating'
import Banner from '../Components/HomeComponents/Banner'
import Innovations from '../Components/HomeComponents/Innovations'
import FeatureGrid from '../Components/HomeComponents/FeatureGrid'
import Testimonials from '../Components/HomeComponents/Testimonials'
import Footer from '../Components/Footer'
import Chatbot from '../Components/HomeComponents/ChatBot'

function Home() {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className='flex flex-col relative min-h-screen bg-nature-50/30 overflow-x-hidden'
    >
      {/* Global ambient background glows */}
      <div className="fixed inset-0 pointer-events-none -z-10 overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-nature-400/10 rounded-full blur-[140px]" />
        <div className="absolute bottom-0 left-1/4 w-[500px] h-[500px] bg-emerald-400/8 rounded-full blur-[120px]" />
      </div>

      <Navbar />
      <div className="pt-24 md:pt-32 flex flex-col gap-6 md:gap-12 pb-20">
        <HeroSection />
        <DashboardPreview />
        <FeatureGrid />
        <Rating />
        <Banner />
        <Innovations />
        <Testimonials />
        <Chatbot />
      </div>
      <Footer />
    </motion.div>
  )
}

export default Home