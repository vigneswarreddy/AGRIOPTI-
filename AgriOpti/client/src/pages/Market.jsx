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
import { FaStore } from 'react-icons/fa'

function Market() {
  return (
    <div className='flex flex-col bg-nature-50/30 min-h-screen overflow-x-hidden'>
      <Navbar />
      <div className="pt-24 md:pt-32 flex flex-col gap-10 md:gap-16 pb-20">

        {/* Premium Market Hero Header */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 relative z-10">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[150px] bg-emerald-400/20 blur-[100px] rounded-full -z-10" />
          <div className="bg-nature-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative py-12 px-8 md:px-12 flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 to-transparent" />
            <div className="relative z-10 space-y-3">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                <FaStore /> AgriOpti Marketplace
              </div>
              <h1 className="text-3xl md:text-5xl font-heading font-black tracking-tight leading-tight uppercase text-white">
                Farm <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Supply Hub</span>
              </h1>
              <p className="text-nature-300 text-sm font-medium max-w-xl">
                Seeds, fertilizers, tools, machinery and more — all sourced from certified suppliers, delivered to your farm.
              </p>
            </div>
            <div className="relative z-10 flex flex-wrap gap-3">
              {['Seeds', 'Fertilizers', 'Tools', 'Machinery'].map(cat => (
                <span key={cat} className="px-4 py-2 rounded-2xl bg-white/5 border border-white/10 text-xs font-black text-nature-300 uppercase tracking-widest">
                  {cat}
                </span>
              ))}
            </div>
          </div>
        </div>

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