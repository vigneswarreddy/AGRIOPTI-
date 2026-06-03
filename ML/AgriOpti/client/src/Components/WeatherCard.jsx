import React, { useEffect, useState } from 'react'
import { useDate } from '../Utils/useDate'
import sun from '../assets/icons/sun.png'
import cloud from '../assets/icons/cloud.png'
import fog from '../assets/icons/fog.png'
import rain from '../assets/icons/rain.png'
import snow from '../assets/icons/snow.png'
import storm from '../assets/icons/storm.png'
import windIcon from '../assets/icons/windy.png'
import { FaWind, FaTint, FaThermometerHalf, FaCalendarAlt, FaClock } from 'react-icons/fa'

const WeatherCard = ({
  temperature,
  windspeed,
  humidity,
  place,
  heatIndex,
  iconString,
  conditions,
}) => {
  const [icon, setIcon] = useState(sun)
  const { time } = useDate()

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
    <div className="backdrop-blur-xl bg-white/70 rounded-[3.5rem] w-[26rem] p-10 border border-white/60 shadow-[0_32px_64px_-16px_rgba(20,40,20,0.1)] relative overflow-hidden group hover:shadow-[0_48px_80px_-24px_rgba(20,40,20,0.15)] transition-all duration-700">
      {/* Background Decorative Element */}
      <div className="absolute -top-20 -right-20 w-64 h-64 bg-nature-400/10 rounded-full blur-[80px] group-hover:bg-nature-400/20 transition-all duration-700"></div>
      <div className="absolute -bottom-20 -left-20 w-64 h-64 bg-earth-400/5 rounded-full blur-[80px]"></div>

      <div className="relative z-10 space-y-12">
        {/* Header: Place and Time */}
        <div className="space-y-4">
          <div className="flex flex-col items-center gap-3">
            <h2 className="text-4xl font-heading font-black text-nature-950 tracking-tighter text-center leading-tight">
              {place}
            </h2>
            <div className="flex items-center gap-4 text-[10px] font-black text-nature-500 uppercase tracking-[0.25em] leading-none bg-nature-50 px-4 py-2 rounded-full border border-nature-100/50">
              <span className="flex items-center gap-2"><FaCalendarAlt className="text-nature-400" /> {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-nature-200"></span>
              <span className="flex items-center gap-2"><FaClock className="text-nature-400" /> {time}</span>
            </div>
          </div>
        </div>

        {/* Main Temperature Section */}
        <div className="flex flex-col items-center space-y-6">
          <div className="w-36 h-36 flex items-center justify-center relative translate-y-0 group-hover:-translate-y-2 transition-transform duration-700">
            <div className="absolute inset-0 bg-nature-100 rounded-full scale-50 group-hover:scale-100 transition-transform duration-700 opacity-40 blur-2xl"></div>
            <img loading="lazy" src={icon} alt="weather_icon" className="w-28 h-28 relative z-10 drop-shadow-[0_20px_40px_rgba(0,0,0,0.15)]" />
          </div>
          <div className="flex flex-col items-center">
            <div className="flex items-start">
              <span className="text-[8.5rem] font-heading font-black text-nature-950 leading-[0.8] tracking-tighter italic">
                {Math.round(temperature)}
              </span>
              <span className="text-4xl font-heading font-black text-nature-600 mt-2 ml-1">&deg;</span>
            </div>
            <div className="mt-4 px-8 py-2.5 rounded-full bg-nature-950 text-white text-xs font-black uppercase tracking-[0.4em] shadow-xl shadow-nature-950/20">
              {conditions}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-5">
          <div className="bg-white p-6 rounded-[2.5rem] border border-nature-100 space-y-2 group/stat hover:border-nature-300 transition-colors shadow-sm">
            <div className="flex items-center gap-2 text-nature-400">
              <FaWind className="text-nature-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Wind Speed</span>
            </div>
            <p className="text-3xl font-heading font-black text-nature-950">
              {windspeed} <span className="text-xs text-nature-400 font-bold uppercase tracking-widest ml-1 font-body italic">km/h</span>
            </p>
          </div>

          <div className="bg-white p-6 rounded-[2.5rem] border border-nature-100 space-y-2 hover:border-nature-300 transition-colors shadow-sm">
            <div className="flex items-center gap-2 text-nature-400">
              <FaTint className="text-nature-500" />
              <span className="text-[10px] font-black uppercase tracking-widest">Humidity</span>
            </div>
            <p className="text-3xl font-heading font-black text-nature-950">
              {humidity}<span className="text-xs text-nature-400 font-bold uppercase tracking-widest ml-1 font-body italic">%</span>
            </p>
          </div>
        </div>

        {/* Heat Index Footer */}
        <div className="pt-8 border-t border-nature-100 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-2xl bg-earth-50 flex items-center justify-center text-earth-600 shadow-inner">
              <FaThermometerHalf size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black text-nature-400 uppercase tracking-widest leading-none mb-2">Thermal Comfort</p>
              <p className="text-xl font-black text-nature-950 leading-none">
                {heatIndex ? `Feels like ${heatIndex}°C` : 'Optimal'}
              </p>
            </div>
          </div>
          <div className="flex gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-nature-300 animate-pulse"></div>
            <div className="w-1.5 h-1.5 rounded-full bg-nature-200 animate-pulse delay-150"></div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default WeatherCard