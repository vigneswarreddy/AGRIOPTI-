import React from 'react'
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
    <div className='flex flex-col relative min-h-screen bg-nature-50/30 overflow-x-hidden'>
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
    </div>
  )
}

export default Home