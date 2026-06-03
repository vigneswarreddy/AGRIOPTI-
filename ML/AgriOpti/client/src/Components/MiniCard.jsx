import React, { useEffect, useState } from 'react'
import sun from '../assets/icons/sun.png'
import cloud from '../assets/icons/cloud.png'
import fog from '../assets/icons/fog.png'
import rain from '../assets/icons/rain.png'
import snow from '../assets/icons/snow.png'
import storm from '../assets/icons/storm.png'
import windIcon from '../assets/icons/windy.png'

const MiniCard = ({ time, temp, iconString, minTemp, maxTemp }) => {
  const [icon, setIcon] = useState(sun)

  useEffect(() => {
    if (iconString) {
      const cond = iconString.toLowerCase();
      if (cond.includes('cloud')) setIcon(cloud);
      else if (cond.includes('rain')) setIcon(rain);
      else if (cond.includes('clear')) setIcon(sun);
      else if (cond.includes('thunder')) setIcon(storm);
      else if (cond.includes('fog')) setIcon(fog);
      else if (cond.includes('snow')) setIcon(snow);
      else if (cond.includes('wind')) setIcon(windIcon);
    }
  }, [iconString])

  return (
    <div className="backdrop-blur-xl bg-white/70 rounded-[2.5rem] p-6 border border-white/40 shadow-sm group hover:shadow-xl hover:-translate-y-2 transition-all duration-500 flex flex-col items-center text-center space-y-4">
      <div className="space-y-2">
        <p className="text-[10px] font-black text-nature-400 uppercase tracking-[0.25em] leading-none">
          {new Date(time).toLocaleDateString('en', { weekday: 'short' })}
        </p>
        <div className="w-6 h-0.5 bg-nature-100 rounded-full mx-auto group-hover:w-10 group-hover:bg-nature-300 transition-all duration-500"></div>
      </div>

      <div className="w-16 h-16 flex items-center justify-center relative translate-y-0 group-hover:-translate-y-1 transition-transform duration-500">
        <div className="absolute inset-0 bg-nature-50 rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity"></div>
        <img loading="lazy" src={icon} alt="forecast" className="w-12 h-12 relative z-10 drop-shadow-md transform group-hover:rotate-12 transition-transform duration-500" />
      </div>

      <div className="flex flex-col items-center">
        <div className="flex items-baseline gap-1">
          <p className="text-2xl font-heading font-black text-nature-950 tracking-tighter italic">
            {Math.round(temp)}&deg;
          </p>
        </div>
        {minTemp !== undefined && maxTemp !== undefined && (
          <div className="flex items-center gap-2 mt-1">
            <span className="text-[10px] font-black text-nature-400 uppercase">{Math.round(minTemp)}&deg;</span>
            <div className="w-4 h-0.5 bg-nature-100 rounded-full"></div>
            <span className="text-[10px] font-black text-nature-600 uppercase">{Math.round(maxTemp)}&deg;</span>
          </div>
        )}
      </div>
    </div>
  )
}

export default MiniCard