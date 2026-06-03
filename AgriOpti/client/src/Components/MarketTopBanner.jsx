import React from 'react'
import { useNavigate } from 'react-router-dom';

const categories = [
    { title: 'Seeds', icon: '🌱', type: 'seeds' },
    { title: 'Crops', icon: '🌾', type: 'crops' },
    { title: 'Pesticides', icon: '🧴', type: 'pesticides' },
    { title: 'Fertilizers', icon: '🧪', type: 'fertilizers' },
    { title: 'Tools', icon: '🛠️', type: 'tools' },
    { title: 'Machinery', icon: '🚜', type: 'machinery' },
    { title: 'Irrigation', icon: '💧', type: 'irrigation' },
    { title: 'Greenhouses', icon: '🏡', type: 'greenhouses' },
    { title: 'Harvesting', icon: '🧺', type: 'harvesting' },
    { title: 'Transport', icon: '🚚', type: 'transport' },
  ];

function MarketTopBanner() {
  const navigate = useNavigate();

  return (
    <div className="px-4 md:px-8 w-full max-w-7xl mx-auto mb-4 relative z-10">
      <div className="flex w-full items-center bg-white/80 backdrop-blur-xl shadow-[0_8px_30px_rgba(0,0,0,0.04)] border border-nature-100/50 rounded-[2.5rem] py-4 px-6 md:px-10 overflow-x-auto custom-scrollbar gap-2 md:gap-4 scroll-smooth">
        {categories.map((category, index) => (
          <div 
            key={index} 
            onClick={() => navigate(`/market/${category.type}`)}
            className="flex flex-col items-center justify-center text-center cursor-pointer group min-w-[80px] p-3 rounded-2xl hover:bg-nature-50 hover:shadow-inner transition-all duration-300"
          >
            <div className="text-3xl md:text-4xl mb-2 group-hover:scale-125 group-hover:-translate-y-1 transition-transform duration-300 drop-shadow-sm">{category.icon}</div>
            <div className="text-[10px] font-black uppercase tracking-widest text-nature-500 group-hover:text-nature-950 transition-colors">{category.title}</div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default MarketTopBanner