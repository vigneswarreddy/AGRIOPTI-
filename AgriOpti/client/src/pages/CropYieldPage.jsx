import React from 'react'
import Navbar from '../Components/Navbar'
import Footer from '../Components/Footer'
import CropYield from '../Components/Dashboard/CropYield'

function CropYieldPage() {
  return (
    <div className="min-h-screen flex flex-col bg-nature-50/30 overflow-x-hidden">
      <Navbar />
      <main className="flex-grow pt-24 md:pt-32 pb-24 px-4 md:px-8 max-w-7xl mx-auto w-full">
        <CropYield />
      </main>
      <Footer />
    </div>
  )
}

export default CropYieldPage
