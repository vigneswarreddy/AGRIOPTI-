import React from 'react';

const Card = ({ title, value, children, variant = 'nature' }) => {
  const variants = {
    nature: 'bg-nature-400/10 group-hover:bg-nature-400/20',
    primary: 'bg-blue-400/10 group-hover:bg-blue-400/20',
    success: 'bg-emerald-400/10 group-hover:bg-emerald-400/20',
    warning: 'bg-amber-400/10 group-hover:bg-amber-400/20',
    danger: 'bg-red-400/10 group-hover:bg-red-400/20',
  };

  const highlightClass = variants[variant] || variants.nature;

  return (
    <div className="glass rounded-[2.5rem] p-8 border-white/60 shadow-xl relative overflow-hidden group transition-all duration-500 hover:shadow-2xl hover:shadow-nature-600/10 h-full flex flex-col">
      <div className={`absolute -top-10 -right-10 w-32 h-32 rounded-full blur-3xl transition-colors ${highlightClass}`}></div>

      <div className="relative z-10 space-y-4 flex flex-col h-full">
        <div className="flex flex-col gap-1">
          <p className="text-[10px] font-black text-nature-500 uppercase tracking-[0.3em] leading-none mb-1">{title}</p>
          {value && (
            <h2 className="text-4xl font-heading font-black text-nature-950 tracking-tighter">
              {value}
            </h2>
          )}
        </div>

        {children && (
          <div className="pt-4 border-t border-nature-100/50 flex-grow flex items-center justify-center">
            {children}
          </div>
        )}
      </div>
    </div>
  );
};

export default Card;
