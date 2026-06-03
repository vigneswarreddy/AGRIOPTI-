import React from 'react';

const Rating = () => {
  return (
    <div className="px-6 md:px-12 lg:px-20 py-16">
      <div className="max-w-7xl mx-auto">
        <div className="glass-dark rounded-[3rem] p-10 md:p-16 flex flex-col lg:flex-row items-center justify-between gap-12 relative overflow-hidden bg-nature-950/90 shadow-2xl">
          {/* Decorative Background Mesh */}
          <div className="absolute top-0 right-0 w-96 h-96 bg-nature-600/20 rounded-full blur-[100px] -z-10 pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 w-80 h-80 bg-earth-600/10 rounded-full blur-[100px] -z-10 pointer-events-none"></div>

          <div className="w-full lg:w-1/2 flex flex-col gap-6">
            <h2 className="text-4xl md:text-5xl font-heading font-black text-white leading-tight">
              Trusted by 25,000+ Farmers Worldwide
            </h2>
            <p className="text-xl text-nature-300 font-medium">
              Join our growing community and achieve your agricultural goals with data-driven insights.
            </p>

            <div className="flex -space-x-4 pt-2">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="w-14 h-14 rounded-full border-4 border-nature-950 bg-nature-100 flex items-center justify-center text-nature-600 font-black text-xl shadow-lg ring-2 ring-white/10 overflow-hidden transform hover:-translate-y-2 transition-transform duration-300">
                  <img loading="lazy" src={`https://i.pravatar.cc/150?u=${i + 20}`} alt="user" className="w-full h-full object-cover" />
                </div>
              ))}
              <div className="w-14 h-14 rounded-full border-4 border-nature-950 bg-nature-600 flex items-center justify-center text-white font-bold text-sm shadow-xl ring-2 ring-white/10 transform hover:-translate-y-2 transition-transform duration-300">
                +25k
              </div>
            </div>
          </div>

          <div className="w-full lg:w-[40%] flex flex-col md:flex-row gap-8 lg:gap-12">
            <div className="text-center md:text-left flex-1 space-y-2">
              <div className="flex justify-center md:justify-start">
                <h3 className="text-5xl font-heading font-black text-white italic drop-shadow-sm">11k+</h3>
              </div>
              <div className="flex justify-center md:justify-start gap-1 pb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-nature-400" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.175 3.62a1 1 0 00.95.69h3.812c.969 0 1.372 1.24.588 1.81l-3.089 2.24a1 1 0 00-.364 1.118l1.175 3.62c.3.921-.755 1.688-1.54 1.118l-3.089-2.24a1 1 0 00-1.176 0l-3.089 2.24c-.784.57-1.838-.197-1.54-1.118l1.175-3.62a1 1 0 00-.364-1.118L2.489 9.047c-.784-.57-.38-1.81.588-1.81h3.812a1 1 0 00.95-.69l1.175-3.62z" />
                  </svg>
                ))}
              </div>
              <p className="text-nature-400 font-bold text-sm uppercase tracking-[0.2em]">Active Daily</p>
            </div>

            <div className="text-center md:text-left flex-1 space-y-2">
              <div className="flex justify-center md:justify-start">
                <h3 className="text-5xl font-heading font-black text-white italic drop-shadow-sm">4.9</h3>
              </div>
              <div className="flex justify-center md:justify-start gap-1 pb-1">
                {[...Array(5)].map((_, i) => (
                  <svg key={i} className="h-5 w-5 text-earth-400" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z" />
                  </svg>
                ))}
              </div>
              <p className="text-nature-400 font-bold text-sm uppercase tracking-[0.2em]">Community Trust</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Rating;
