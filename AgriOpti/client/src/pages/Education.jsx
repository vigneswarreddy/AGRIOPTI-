import React from 'react';
import Navbar from '../Components/Navbar';
import GovernmentSchemes from '../Components/Education/GovernmentSchemes';
import Organic from '../Components/Education/Organic';
import Footer from '../Components/Footer';
import { FaGraduationCap } from 'react-icons/fa';

function Education() {
  return (
    <div className="min-h-screen flex flex-col bg-nature-50/30">

      {/* Navbar */}
      <Navbar />

      <main className="flex-grow pt-24 md:pt-32">

        {/* Hero Section */}
        <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mb-8 relative z-10">
          <div className="bg-nature-950/95 backdrop-blur-3xl rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden relative py-16 px-8 md:px-12 flex flex-col items-center text-center">
            <div className="absolute inset-0 z-0 opacity-40">
              <div
                className="absolute inset-0"
                style={{
                  backgroundImage: 'url("https://wallpaperaccess.com/full/1598226.jpg")',
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                  filter: 'saturate(1.2)'
                }}
              ></div>
              <div className="absolute inset-0 bg-nature-950/80"></div>
            </div>
            
            <div className="relative z-10 space-y-6 max-w-4xl mx-auto">
              <div className="inline-flex items-center gap-3 px-4 py-1.5 rounded-full bg-emerald-600/20 border border-emerald-600/30 text-emerald-400 text-[10px] font-black uppercase tracking-[0.2em] shadow-sm">
                <FaGraduationCap /> Knowledge Repository
              </div>
              <h1 className="text-4xl md:text-5xl font-heading font-black tracking-tight leading-none uppercase text-white">
                Agriculture <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-600">Education</span>
              </h1>
              <p className="text-nature-300 text-sm md:text-base font-medium leading-relaxed max-w-3xl mx-auto">
                Cultivating knowledge for sustainable farming, enhancing food security and environmental stewardship. Empowering students with practical skills and scientific insights, fostering innovation in crop production and livestock management.
              </p>
            </div>
          </div>
        </div>

        {/* Content Sections (FIXED - NO OVERLAP) */}
        <div className="relative z-10 mt-10 md:mt-20 space-y-20 pb-20">

          {/* Government Schemes Section */}
          <section className="max-w-7xl mx-auto px-6">
            <GovernmentSchemes />
          </section>

          {/* Organic Farming Section */}
          <section className="max-w-7xl mx-auto px-6">
            <Organic />
          </section>

        </div>

      </main>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Education;