import React from 'react';
import { FaQuoteLeft, FaStar } from 'react-icons/fa';

const testimonials = [
  {
    quote: "AgriOpti's precision farming tools and AI insights have drastically improved my crop yield and reduced waste.",
    name: "Alex P.",
    role: "Commercial Farmer",
    image: 'https://www.softlinesolutions.com/wp-content/uploads/2022/05/ANDRE-PNG-768x768-1.png?text=A'
  },
  {
    quote: "The satellite analysis and predictive chatbot have been invaluable for planning and decision-making on my land.",
    name: "Emily R.",
    role: "Agricultural Consultant",
    image: 'https://clipart-library.com/2023/woman-face-clipart-xl.png?text=E'
  },
  {
    quote: "Their support and intelligent fertilizer advisor helped me implement sustainable practices that benefit both my farm and the environment.",
    name: "James W.",
    role: "Organic Farmer",
    image: 'https://cdn.pixabay.com/photo/2024/01/23/08/08/man-8527031_960_720.png?text=J'
  }
];

const Testimonials = () => {
  return (
    <section className="max-w-7xl mx-auto px-4 md:px-8 py-16 md:py-24">
      <div className="flex flex-col lg:flex-row gap-12 items-center">
        
        {/* Left Side text */}
        <div className="lg:w-[40%] flex flex-col items-start text-left space-y-6">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-nature-100 border border-nature-200 text-nature-700 text-xs font-black uppercase tracking-[0.2em] shadow-sm">
            Community Trust
          </div>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-heading font-black text-nature-950 uppercase tracking-tight leading-[1.1]">
            Farmers <span className="text-transparent bg-clip-text bg-gradient-to-r from-nature-500 to-nature-700">Trust</span> AgriOpti
          </h2>
          <p className="text-nature-600 text-lg font-medium">
            Discover how AgriOpti is transforming modern farming through innovative technology and unparalleled AI support. Hear from our farmers about their experiences and successes.
          </p>
          <button className="mt-4 px-8 py-4 rounded-2xl bg-nature-950 text-white font-black uppercase tracking-wider hover:bg-nature-800 transition-all duration-300 shadow-xl">
            Read Success Stories
          </button>
        </div>

        {/* Right Side Cards */}
        <div className="lg:w-[60%] grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Decorative mesh */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full h-[300px] bg-nature-400/20 blur-[100px] rounded-full -z-10"></div>
          
          <div className="flex flex-col gap-6 pt-12">
            <TestimonialCard testimonial={testimonials[0]} />
            <TestimonialCard testimonial={testimonials[2]} />
          </div>
          <div className="flex flex-col gap-6">
            <TestimonialCard testimonial={testimonials[1]} />
          </div>
        </div>

      </div>
    </section>
  );
};

const TestimonialCard = ({ testimonial }) => (
  <div className="bg-white/80 backdrop-blur-xl border border-nature-100 shadow-xl hover:shadow-2xl rounded-[2.5rem] p-8 transition-all duration-500 hover:-translate-y-1">
    <div className="flex items-center gap-1 mb-4 text-earth-400 text-sm">
      <FaStar /><FaStar /><FaStar /><FaStar /><FaStar />
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
  </div>
);

export default Testimonials;
