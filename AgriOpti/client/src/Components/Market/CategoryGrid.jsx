import React from 'react';
import { useNavigate } from 'react-router-dom';
import { FaArrowRight } from 'react-icons/fa';

const categories = [
  {
    id: 'seeds',
    name: 'Premium Seeds',
    desc: 'High-yield hybrid and organic seeds',
    image: 'https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?auto=format&fit=crop&q=80&w=800',
    color: 'from-nature-600 to-nature-800'
  },
  {
    id: 'pesticides',
    name: 'Crop Protection',
    desc: 'Safe and effective pest control solutions',
    image: 'https://images.unsplash.com/photo-1628352081506-83c43123ed6d?auto=format&fit=crop&q=80&w=800',
    color: 'from-blue-600 to-blue-800'
  },
  {
    id: 'machinery',
    name: 'Modern Machinery',
    desc: 'Tractors, pumps, and automated tools',
    image: 'https://images.unsplash.com/photo-1594488687126-ed421bc27736?auto=format&fit=crop&q=80&w=800',
    color: 'from-amber-600 to-amber-800'
  },
  {
    id: 'fertilizers',
    name: 'Soil Nutrition',
    desc: 'Organic and mineral-based fertilizers',
    image: 'https://images.unsplash.com/photo-1592651034426-ed86b208fa52?auto=format&fit=crop&q=80&w=800',
    color: 'from-emerald-600 to-emerald-800'
  }
];

const CategoryGrid = () => {
  const navigate = useNavigate();

  return (
    <div className="max-w-7xl mx-auto px-6 md:px-12 py-16">
      <div className="flex flex-col md:flex-row items-end justify-between mb-12 gap-6">
        <div className="space-y-2">
          <h2 className="text-3xl md:text-5xl font-heading font-black text-nature-950 tracking-tight">
            Shop by <span className="text-nature-600">Category</span>
          </h2>
          <p className="text-nature-500 font-bold uppercase tracking-widest text-xs">Professional supplies for your agriculture needs</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
        {categories.map((cat) => (
          <div 
            key={cat.id}
            onClick={() => navigate(`/market/${cat.id}`)}
            className="group relative h-[450px] rounded-[3rem] overflow-hidden cursor-pointer shadow-xl hover:shadow-2xl transition-all duration-700"
          >
            {/* Background Image */}
            <div 
              className="absolute inset-0 bg-cover bg-center transition-transform duration-1000 group-hover:scale-110"
              style={{ backgroundImage: `url(${cat.image})` }}
            />
            
            {/* Overlay Gradient */}
            <div className={`absolute inset-0 bg-gradient-to-b from-transparent via-black/20 to-black/90 group-hover:to-black transition-all duration-500`} />
            
            {/* Content */}
            <div className="absolute inset-0 p-8 flex flex-col justify-end text-white">
              <div className="mb-4 transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                <span className={`inline-block px-3 py-1 rounded-full bg-gradient-to-r ${cat.color} text-[10px] font-black uppercase tracking-widest mb-3`}>
                  Premium
                </span>
                <h3 className="text-3xl font-heading font-black tracking-tight mb-2">
                  {cat.name}
                </h3>
                <p className="text-white/60 text-sm font-medium leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-700 delay-100">
                  {cat.desc}
                </p>
              </div>
              
              <div className="flex items-center gap-3 text-xs font-black uppercase tracking-widest opacity-0 group-hover:opacity-100 transition-all duration-500 translate-y-4 group-hover:translate-y-0">
                Explore Now <FaArrowRight className="group-hover:translate-x-2 transition-transform" />
              </div>
            </div>

            {/* Shine Effect */}
            <div className="absolute inset-0 bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />
          </div>
        ))}
      </div>
    </div>
  );
};

export default CategoryGrid;
