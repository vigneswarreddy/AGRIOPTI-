import React from 'react'
import Navbar from "../Components/Navbar"
import HeroCarasoule from '../Components/HeroCarasoule'
import MarketTopBanner from '../Components/MarketTopBanner'
import Seeds from '../Components/seeds'
import Crops from '../Components/crops'
import Pest from '../Components/pest'
import Fertilizers from '../Components/fertilizer'
import Tools from '../Components/Tools'
import Machinery from '../Components/machinery'
import Footer from '../Components/Footer'

function Market() {
  return (
    <div className='flex flex-col bg-nature-50/30 min-h-screen overflow-x-hidden'>
      <Navbar />
      <div className="pt-24 md:pt-32 flex flex-col gap-10 md:gap-16 pb-20">
        <MarketTopBanner />
        <div className="max-w-7xl mx-auto w-full px-4 md:px-8">
          <HeroCarasoule />
        </div>
        <div className="flex flex-col gap-8 md:gap-16">
          <Seeds />
          <Crops />
          <Pest />
          <Fertilizers />
          <Tools />
          <Machinery />
        </div>
      </div>
      <Footer />
    </div>
  )
}

export default Market