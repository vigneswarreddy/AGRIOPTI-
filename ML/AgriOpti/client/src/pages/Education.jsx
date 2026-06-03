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
        <div className="h-[700px] w-full relative flex items-center justify-center overflow-hidden">

          {/* Background Image */}
          <div
            className="absolute inset-0 z-0 scale-110"
            style={{
              backgroundImage: 'url("https://wallpaperaccess.com/full/1598226.jpg")',
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              filter: 'brightness(0.4) saturate(1.2)'
            }}
          ></div>

          {/* Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-nature-950/40 via-transparent to-nature-50/30 z-[1]"></div>

          {/* Hero Content */}
          <div className="max-w-5xl mx-auto relative z-10 px-6 text-center space-y-8 animate-in fade-in zoom-in duration-1000">

            <div className="inline-flex items-center gap-3 px-6 py-2 rounded-full bg-nature-400/20 border border-nature-400/30 text-nature-100 text-xs font-black uppercase tracking-[0.3em] backdrop-blur-md">
              <FaGraduationCap /> Knowledge Repository
            </div>

            <h1 className="text-2xl md:text-3xl font-heading font-black text-white leading-relaxed tracking-tight [text-shadow:_0_4px_12px_rgba(0,0,0,0.5)]">
              Agriculture education cultivates knowledge for sustainable farming, enhancing food security and environmental stewardship. It empowers students with practical skills and scientific insights, fostering innovation in crop production and livestock management.
            </h1>

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