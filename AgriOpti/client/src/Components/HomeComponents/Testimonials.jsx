import React from 'react';
import { motion } from 'framer-motion';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    quote: "AgriOpti's precision farming tools and AI insights have drastically improved my crop yield and reduced waste.",
    name: 'Alex P.',
    role: 'Commercial Farmer',
    image: 'https://www.softlinesolutions.com/wp-content/uploads/2022/05/ANDRE-PNG-768x768-1.png?text=A',
  },
  {
    quote: 'The satellite analysis and predictive chatbot have been invaluable for planning and decision-making on my land.',
    name: 'Emily R.',
    role: 'Agricultural Consultant',
    image: 'https://clipart-library.com/2023/woman-face-clipart-xl.png?text=E',
  },
  {
    quote: 'Their support and intelligent fertilizer advisor helped me implement sustainable practices that benefit both my farm and the environment.',
    name: 'James W.',
    role: 'Organic Farmer',
    image: 'https://cdn.pixabay.com/photo/2024/01/23/08/08/man-8527031_960_720.png?text=J',
  },
];

const statsBar = [
  { value: '12.5k+', label: 'Farmers Worldwide' },
  { value: '98%', label: 'Satisfaction Rate' },
  { value: '45k+', label: 'Crops Analyzed' },
  { value: '5', label: 'Languages Supported' },
];

const Testimonials = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">

      {/* Running stats banner */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-20 p-6 md:p-8 bg-nature-950 rounded-[2.5rem] border border-nature-800"
      >
        {statsBar.map((s, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1, duration: 0.4 }}
            className="flex flex-col items-center text-center"
          >
            <span className="text-3xl md:text-4xl font-heading font-black text-white tracking-tighter leading-none">{s.value}</span>
            <span className="text-[10px] font-black text-nature-500 uppercase tracking-[0.2em] mt-1">{s.label}</span>
          </motion.div>
        ))}
      </motion.div>

      <div className="flex flex-col lg:flex-row gap-12 items-center">

        {/* Left Side text */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="lg:w-[40%] flex flex-col items-start text-left space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nature-100 border border-nature-200 text-nature-700 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
            Community Trust
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-nature-950 uppercase tracking-tight leading-[1.1]">
            Farmers{' '}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-500 to-nature-700">Trust</span>{' '}
            AgriOpti
          </h2>
          <p className="text-nature-600 text-lg font-medium leading-relaxed">
            Discover how AgriOpti is transforming modern farming through innovative technology and unparalleled AI support.
          </p>
          <motion.button
            whileHover={{ scale: 1.05, y: -2 }}
            whileTap={{ scale: 0.97 }}
            className="mt-4 px-8 py-4 rounded-2xl bg-nature-950 text-white font-black uppercase tracking-wider hover:bg-nature-800 transition-colors duration-300 shadow-xl"
          >
            Read Success Stories
          </motion.button>
        </motion.div>

        {/* Right Side Cards */}
        <div className="lg:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-nature-400/20 blur-[100px] rounded-full -z-10" />

          <div className="flex flex-col gap-6 pt-0 md:pt-12">
            <TestimonialCard testimonial={testimonials[0]} delay={0.1} />
            <TestimonialCard testimonial={testimonials[2]} delay={0.3} />
          </div>
          <div className="flex flex-col gap-6">
            <TestimonialCard testimonial={testimonials[1]} delay={0.2} />
          </div>
        </div>
      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial, delay = 0 }) => (
  <motion.div
    initial={{ opacity: 0, y: 30 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: '-40px' }}
    transition={{ delay, duration: 0.5, ease: 'easeOut' }}
    whileHover={{ y: -6, transition: { duration: 0.2 } }}
    className="bg-white/80 backdrop-blur-xl border border-nature-100 shadow-xl hover:shadow-2xl rounded-[2.5rem] p-8 transition-shadow duration-500"
  >
    <div className="flex items-center gap-1 mb-4 text-amber-400 text-sm">
      {[...Array(5)].map((_, i) => <FaStar key={i} />)}
    </div>
    <FaQuoteLeft className="text-3xl text-nature-100 mb-4" />
    <p className="text-nature-900 font-medium leading-relaxed mb-8">
      "{testimonial.quote}"
    </p>
    <div className="flex items-center gap-4">
      <div className="w-12 h-12 rounded-full overflow-hidden border-2 border-nature-100 bg-nature-50">
        <img loading="lazy" src={testimonial.image} alt={testimonial.name} className="w-full h-full object-cover" />
      </div>
      <div>
        <h4 className="text-nature-950 font-black uppercase tracking-tight">{testimonial.name}</h4>
        <p className="text-[10px] font-bold text-nature-400 uppercase tracking-widest">{testimonial.role}</p>
      </div>
    </div>
  </motion.div>
);

export default Testimonials;
