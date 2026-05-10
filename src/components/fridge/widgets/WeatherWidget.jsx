import React, { useState, useEffect } from 'react';
import { Sun, Cloud, CloudRain, Snowflake, CloudSun, Wind, Droplets, Thermometer, Minimize2 } from 'lucide-react';
import Magnet from '../Magnet';

const weatherIcons = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  snowy: Snowflake,
  partly_cloudy: CloudSun
};

const weatherGradients = {
  sunny: 'from-amber-400 via-orange-300 to-yellow-200',
  cloudy: 'from-slate-400 via-slate-300 to-gray-200',
  rainy: 'from-blue-400 via-slate-400 to-gray-300',
  snowy: 'from-blue-100 via-white to-blue-50',
  partly_cloudy: 'from-sky-300 via-blue-200 to-amber-100'
};

const themeOverrides = {
  midnight: 'from-slate-700 via-indigo-800 to-slate-900',
  sunset: 'from-orange-400 via-rose-500 to-pink-600',
  ocean: 'from-cyan-400 via-blue-500 to-indigo-600',
  forest: 'from-emerald-400 via-green-500 to-teal-600',
  candy: 'from-pink-400 via-fuchsia-500 to-purple-600'
};

export default function WeatherWidget({ 
  weather = 'sunny', 
  temperature = 72, 
  location = 'Your City',
  isDragging = false,
  onMinimize,
  theme = 'default'
}) {
  const [currentTime, setCurrentTime] = useState(new Date());
  const WeatherIcon = weatherIcons[weather] || Sun;
  const gradient = weatherGradients[weather] || weatherGradients.sunny;

  useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 60000);
    return () => clearInterval(timer);
  }, []);

  const isNight = currentTime.getHours() >= 19 || currentTime.getHours() < 6;

  return (
    <div className={`
      relative group
      ${isDragging ? 'scale-110 z-50' : 'hover:scale-105'}
      transition-all duration-300
    `}>
      {/* Minimize button */}
      {onMinimize && (
        <button
          onClick={(e) => { e.stopPropagation(); onMinimize(); }}
          className="absolute -top-1 -right-1 z-20 p-1 bg-white/90 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white"
          title="Minimize"
        >
          <Minimize2 className="w-3 h-3 text-gray-600" />
        </button>
      )}
      {/* Magnet clip */}
      <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
        <Magnet shape="circle" color="blue" size="sm" />
      </div>
      
      {/* Weather card - thermometer style */}
      <div className={`relative w-36 md:w-40 bg-gradient-to-br ${theme !== 'default' && themeOverrides[theme] ? themeOverrides[theme] : gradient} rounded-2xl shadow-xl overflow-hidden`}>
        {/* Glass effect */}
        <div className="absolute inset-0 bg-white/20 backdrop-blur-sm" />
        
        {/* Top section */}
        <div className="relative p-4 pb-2 text-center">
          <div className="text-xs font-semibold text-white/90 mb-2 drop-shadow-sm uppercase tracking-wider">
            {location}
          </div>
          
          <div className="relative inline-block">
            <WeatherIcon className="w-12 h-12 text-white drop-shadow-lg mx-auto" strokeWidth={1.5} />
            {weather === 'sunny' && !isNight && (
              <div className="absolute inset-0 animate-pulse">
                <div className="absolute inset-0 bg-white/30 rounded-full blur-xl" />
              </div>
            )}
          </div>
          
          <div className="flex items-start justify-center mt-2">
            <span className="text-4xl font-light text-white drop-shadow-md">{temperature}</span>
            <span className="text-lg text-white/80 mt-1">°F</span>
          </div>
        </div>
        
        {/* Bottom section - mini stats */}
        <div className="relative bg-white/30 backdrop-blur-sm px-3 py-2 flex justify-around border-t border-white/20">
          <div className="flex items-center gap-1 text-white/90">
            <Wind className="w-3 h-3" />
            <span className="text-[10px]">12mph</span>
          </div>
          <div className="flex items-center gap-1 text-white/90">
            <Droplets className="w-3 h-3" />
            <span className="text-[10px]">45%</span>
          </div>
        </div>
      </div>
    </div>
  );
}