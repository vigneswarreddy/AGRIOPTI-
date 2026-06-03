import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaRobot, FaLeaf, FaCloudSun, FaArrowRight, FaChartLine, FaUsers, FaSeedling } from 'react-icons/fa';

const floatVariant = (delay = 0) => ({
  animate: {
    y: [0, -14, 0],
    transition: { duration: 5 + delay, repeat: Infinity, ease: 'easeInOut', delay },
  },
});

const stats = [
  { value: '12.5k+', label: 'Farmers' },
  { value: '6', label: 'AI Models' },
  { value: '5', label: 'Languages' },
  { value: '99.9%', label: 'Uptime' },
];

function HeroSection() {
  return (
    <div className="w-full px-4 md:px-8 max-w-7xl mx-auto relative mt-4 md:mt-8">
      {/* Ambient glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-3xl h-[400px] bg-nature-400/20 blur-[120px] rounded-full -z-10 animate-pulse" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.7, ease: 'easeOut' }}
        className="w-full flex flex-col lg:flex-row items-center justify-between gap-12 bg-white/50 backdrop-blur-2xl rounded-[3rem] p-8 md:p-16 border border-white/60 shadow-[0_20px_60px_rgba(0,0,0,0.07)] relative overflow-hidden"
      >
        {/* Gradient mesh */}
        <div className="absolute inset-0 bg-gradient-to-br from-nature-50/50 to-white/10 opacity-60 z-0" />

        {/* ── LEFT: Text ── */}
        <div className="flex-1 flex flex-col items-center lg:items-start text-center lg:text-left z-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-nature-100 border border-nature-200 text-nature-700 text-xs font-black uppercase tracking-[0.2em] mb-6 shadow-sm"
          >
            <span className="w-2 h-2 rounded-full bg-nature-500 animate-pulse" />
            AgriOpti Intelligence v2.0
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="text-5xl md:text-7xl font-heading font-black text-nature-950 tracking-tight leading-[1.1] uppercase mb-6 drop-shadow-sm"
          >
            Grow Smarter,{' '}
            <br className="hidden lg:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-500 to-nature-700">
              Learn Better
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.6 }}
            className="text-lg md:text-xl text-nature-600 font-medium max-w-xl mb-10 leading-relaxed"
          >
            Your premium AI-powered agricultural suite. One-time solution for all agricultural needs, from planning to harvest.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto"
          >
            <Link to="/dashboard">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-nature-600 text-white font-black uppercase tracking-wider hover:bg-nature-700 hover:shadow-xl hover:shadow-nature-600/30 transition-colors duration-300 flex items-center justify-center gap-3 group"
              >
                Explore Platform
                <FaArrowRight className="group-hover:translate-x-1 transition-transform" />
              </motion.button>
            </Link>
            <Link to="/ai-chatbot">
              <motion.button
                whileHover={{ scale: 1.05, y: -2 }}
                whileTap={{ scale: 0.97 }}
                className="w-full sm:w-auto px-8 py-4 rounded-2xl bg-white border border-nature-200 text-nature-700 font-black uppercase tracking-wider hover:border-nature-400 hover:text-nature-600 hover:shadow-lg transition-all duration-300 flex items-center justify-center gap-3"
              >
                <FaRobot className="text-nature-500" /> Ask AI
              </motion.button>
            </Link>
          </motion.div>

          {/* Stats bar */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.6 }}
            className="flex flex-wrap gap-6 mt-10 justify-center lg:justify-start"
          >
            {stats.map((s, i) => (
              <div key={i} className="flex flex-col items-center lg:items-start">
                <span className="text-2xl font-heading font-black text-nature-950 tracking-tighter leading-none">{s.value}</span>
                <span className="text-[10px] font-black text-nature-400 uppercase tracking-[0.2em] mt-0.5">{s.label}</span>
              </div>
            ))}
          </motion.div>
        </div>

        {/* ── RIGHT: Floating Mockup ── */}
        <div className="flex-1 w-full max-w-lg lg:max-w-none relative z-10 hidden md:block">
          <div className="relative w-full aspect-square md:aspect-video lg:aspect-square flex items-center justify-center">

            {/* Center Main Card */}
            <motion.div
              variants={floatVariant(0)}
              animate="animate"
              className="absolute w-[260px] h-[310px] bg-white rounded-[2rem] border border-nature-100 shadow-2xl p-6 flex flex-col justify-between z-20"
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-12 rounded-xl bg-nature-100 flex items-center justify-center text-nature-600">
                  <FaChartLine className="text-xl" />
                </div>
                <span className="px-3 py-1 bg-green-100 text-green-700 text-[10px] font-bold rounded-full uppercase tracking-wider">Active</span>
              </div>
              <div>
                <p className="text-sm text-nature-500 font-medium">Crop Yield Forecast</p>
                <h3 className="text-4xl font-black text-nature-950 tracking-tighter mt-1">+24%</h3>
              </div>
              <div className="w-full h-24 bg-gradient-to-t from-nature-100 to-transparent rounded-xl flex items-end justify-around px-2 pb-2">
                {[40, 60, 45, 80, 55, 90, 75].map((h, i) => (
                  <motion.div
                    key={i}
                    initial={{ height: 0 }}
                    animate={{ height: `${h}%` }}
                    transition={{ delay: 0.9 + i * 0.07, duration: 0.5, ease: 'easeOut' }}
                    className="w-3 bg-nature-400 rounded-full"
                  />
                ))}
              </div>
            </motion.div>

            {/* Floating Card 1 — Weather */}
            <motion.div
              variants={floatVariant(1)}
              animate="animate"
              className="absolute top-[10%] right-[0%] w-[200px] bg-white/80 backdrop-blur-md rounded-3xl border border-nature-100 shadow-xl p-4 flex items-center gap-4 z-30"
            >
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-500">
                <FaCloudSun />
              </div>
              <div>
                <p className="text-[10px] text-nature-400 font-bold uppercase">Optimal Weather</p>
                <p className="text-sm font-black text-nature-900">28°C, Clear</p>
              </div>
            </motion.div>

            {/* Floating Card 2 — AI Insight */}
            <motion.div
              variants={floatVariant(2)}
              animate="animate"
              className="absolute bottom-[15%] left-[-10%] w-[220px] bg-nature-950 rounded-3xl border border-nature-800 shadow-2xl p-5 flex flex-col gap-3 z-30"
            >
              <div className="flex items-center gap-3">
                <FaRobot className="text-nature-400 text-xl" />
                <p className="text-xs text-nature-300 font-bold uppercase tracking-wider">AI Analysis</p>
              </div>
              <p className="text-white text-sm font-medium leading-relaxed">
                "Soil moisture is ideal. Apply fertilizer within 2 days."
              </p>
            </motion.div>

            {/* Floating Card 3 — Soil Health */}
            <motion.div
              variants={floatVariant(0.5)}
              animate="animate"
              className="absolute top-[60%] right-[-5%] w-[160px] bg-white/90 backdrop-blur-xl rounded-[2rem] border border-nature-100 shadow-xl p-4 flex flex-col items-center justify-center gap-2 z-10"
            >
              <div className="relative w-16 h-16">
                <svg className="w-full h-full transform -rotate-90">
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" className="text-nature-100" />
                  <circle cx="32" cy="32" r="28" stroke="currentColor" strokeWidth="6" fill="transparent" strokeDasharray="175" strokeDashoffset="20" className="text-nature-500" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-nature-900 font-black text-sm">92%</div>
              </div>
              <p className="text-[10px] text-nature-500 font-bold uppercase tracking-widest text-center">Soil Health</p>
            </motion.div>

          </div>
        </div>
      </motion.div>
    </div>
  );
}

export default HeroSection;