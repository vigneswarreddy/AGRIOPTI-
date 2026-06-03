import React from 'react';
import { motion } from 'framer-motion';
import { FaServer, FaUsers, FaSeedling, FaLeaf, FaRobot } from 'react-icons/fa';

const cardVariant = {
  hidden: { opacity: 0, y: 30 },
  visible: (i) => ({
    opacity: 1,
    y: 0,
    transition: { delay: i * 0.12, duration: 0.5, ease: 'easeOut' },
  }),
};

const activityFeed = [
  { label: 'Crop Disease Detected: Rust', sub: 'Karnataka, India • Just now', dot: 'bg-emerald-400' },
  { label: 'Yield Forecast Generated', sub: 'Maharashtra, India • 2 mins ago', dot: 'bg-nature-400' },
  { label: 'Fertilizer Purchase Completed', sub: 'Punjab, India • 5 mins ago', dot: 'bg-nature-300' },
  { label: 'AI Chatbot Query — Rice Disease', sub: 'Tamil Nadu, India • 7 mins ago', dot: 'bg-nature-200' },
];

const stats = [
  { icon: <FaUsers />, value: '12.5k+', label: 'Active Farmers', dark: false },
  { icon: <FaServer />, value: '99.9%', label: 'AI Uptime', dark: true },
  { icon: <FaSeedling />, value: '45k+', label: 'Crops Scanned', dark: false },
  { icon: <FaLeaf />, value: '6+', label: 'AI Models', dark: false },
];

function DashboardPreview() {
  return (
    <div className="w-full max-w-7xl mx-auto px-4 md:px-8 mt-10 mb-4">
      {/* Section label */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="flex flex-col items-center text-center mb-10 space-y-3"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nature-100 border border-nature-200 text-nature-700 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
          Platform Metrics
        </div>
        <h2 className="text-3xl md:text-4xl font-heading font-black text-nature-950 tracking-tight uppercase">
          Built for <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-500 to-nature-700">Real Impact</span>
        </h2>
      </motion.div>

      <div className="flex flex-col md:flex-row gap-6">

        {/* Stats Grid */}
        <div className="flex-1 grid grid-cols-2 gap-4">
          {stats.map((s, i) => (
            <motion.div
              key={i}
              custom={i}
              variants={cardVariant}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true }}
              whileHover={{ y: -4, transition: { duration: 0.2 } }}
              className={`rounded-3xl p-6 flex flex-col justify-between shadow-sm hover:shadow-lg transition-shadow relative overflow-hidden ${
                s.dark
                  ? 'bg-nature-950 border border-nature-800'
                  : 'bg-white border border-nature-100'
              }`}
            >
              {s.dark && (
                <div className="absolute -right-4 -top-4 w-24 h-24 bg-nature-600/20 blur-xl rounded-full" />
              )}
              <div className={`w-10 h-10 rounded-full flex items-center justify-center z-10 ${
                s.dark ? 'bg-nature-800 text-nature-400' : 'bg-nature-100 text-nature-600'
              }`}>
                {s.icon}
              </div>
              <div className="mt-4 z-10">
                <p className={`text-3xl font-black tracking-tighter ${s.dark ? 'text-white' : 'text-nature-950'}`}>
                  {s.value}
                </p>
                <p className={`text-xs font-bold uppercase tracking-widest mt-1 ${s.dark ? 'text-nature-500' : 'text-nature-400'}`}>
                  {s.label}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Live Activity Feed */}
        <motion.div
          initial={{ opacity: 0, x: 30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="flex-1 bg-white rounded-3xl p-8 border border-nature-100 shadow-sm"
        >
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <h3 className="text-lg font-black text-nature-950 uppercase tracking-tighter">Live Platform Activity</h3>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">Live</span>
              <span className="flex h-3 w-3 relative">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-3 w-3 bg-emerald-500" />
              </span>
            </div>
          </div>

          <div className="space-y-5">
            {activityFeed.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.1, duration: 0.4 }}
                className="flex items-start gap-4 p-3 rounded-2xl hover:bg-nature-50 transition-colors"
              >
                <div className={`w-2.5 h-2.5 rounded-full ${item.dot} mt-1.5 shrink-0`} />
                <div>
                  <p className="text-sm font-bold text-nature-900">{item.label}</p>
                  <p className="text-xs text-nature-500 mt-0.5">{item.sub}</p>
                </div>
              </motion.div>
            ))}
          </div>

          <div className="mt-6 pt-5 border-t border-nature-100 flex items-center justify-between">
            <span className="text-[10px] font-black text-nature-400 uppercase tracking-widest">Powered by AgriOpti AI</span>
            <div className="flex items-center gap-1.5">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[10px] font-black text-emerald-600 uppercase tracking-widest">All Systems Nominal</span>
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

export default DashboardPreview;
