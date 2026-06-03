import React from 'react';
import { motion } from 'framer-motion';
import innovation1 from '../../assets/home/innovation1.jpg';
import innovation2 from '../../assets/home/innovation2.png';
import innovation3 from '../../assets/home/innovation3.png';

const items = [
  {
    img: innovation2,
    title: 'Expert Instruction',
    desc: 'Access real-world expertise for valuable guidance and mentorship in our virtual classrooms.',
    accent: 'from-nature-500/20 to-nature-300/10',
    tag: 'Learn',
  },
  {
    img: innovation1,
    title: 'Flexible Learning',
    desc: 'Access online learning tailored to your schedule, available anywhere with an internet connection.',
    accent: 'from-emerald-500/20 to-emerald-300/10',
    tag: 'Adapt',
  },
  {
    img: innovation3,
    title: 'Practical Skills',
    desc: 'Acquire hands-on practical skills designed for real-world agricultural success and sustainability.',
    accent: 'from-nature-600/20 to-nature-400/10',
    tag: 'Apply',
  },
];

const Innovations = () => {
  return (
    <div className="px-4 md:px-8 py-16 max-w-7xl mx-auto">
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
        className="text-center max-w-3xl mx-auto mb-16 space-y-4"
      >
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nature-100 border border-nature-200 text-nature-700 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
          Innovating Agriculture
        </div>
        <h2 className="text-4xl md:text-5xl font-heading font-black text-nature-950 tracking-tight leading-tight uppercase">
          Our Core{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-500 to-nature-700">
            Innovations
          </span>
        </h2>
        <p className="text-lg text-nature-600 font-medium">
          Discover the unique benefits you will enjoy when you join our online platform for intelligent farming optimization.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 lg:gap-10">
        {items.map((item, idx) => (
          <motion.div
            key={idx}
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-40px' }}
            transition={{ delay: idx * 0.15, duration: 0.6, ease: 'easeOut' }}
            whileHover={{ y: -8, transition: { duration: 0.25 } }}
            className="group relative"
          >
            {/* Shadow bloom */}
            <div className={`absolute inset-0 bg-gradient-to-b ${item.accent} rounded-[2.5rem] transform translate-y-4 group-hover:translate-y-6 transition-transform duration-500 -z-10`} />

            <div className="bg-white rounded-[2.5rem] p-8 h-full shadow-xl border border-nature-100 transition-shadow duration-500 hover:shadow-2xl">
              {/* Tag */}
              <div className="flex justify-between items-center mb-6">
                <span className="text-[10px] font-black text-nature-400 uppercase tracking-[0.3em]">{item.tag}</span>
                <div className="w-2 h-2 rounded-full bg-nature-400 group-hover:bg-emerald-500 transition-colors" />
              </div>

              <div className="mb-8 overflow-hidden rounded-2xl aspect-[4/3] bg-nature-50 flex items-center justify-center">
                <img
                  loading="lazy"
                  src={item.img}
                  alt={item.title}
                  className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                />
              </div>
              <h3 className="text-2xl font-heading font-black text-nature-900 mb-4 group-hover:text-nature-600 transition-colors uppercase tracking-tight">
                {item.title}
              </h3>
              <p className="text-nature-600 font-medium leading-relaxed">
                {item.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default Innovations;
