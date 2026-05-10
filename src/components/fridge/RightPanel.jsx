import React, { useState, useEffect } from 'react';
import { Cloud, Sun, CloudRain, Wind, Plus, Check, Circle } from 'lucide-react';

const WEATHER_ICONS = {
  sunny: Sun,
  cloudy: Cloud,
  rainy: CloudRain,
  windy: Wind,
};

function WeatherCard() {
  const [weather] = useState({ condition: 'sunny', temp: 72, city: 'Your City', hi: 76, lo: 61 });
  const Icon = WEATHER_ICONS[weather.condition] || Sun;

  return (
    <div className="rounded-2xl bg-gradient-to-br from-sky-100 to-blue-50 border border-sky-200/80 p-3.5 mb-3">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-[10px] font-medium text-sky-500 uppercase tracking-wider">{weather.city}</p>
          <p className="text-2xl font-bold text-sky-900 mt-0.5 leading-none">{weather.temp}°</p>
          <p className="text-[11px] text-sky-600 mt-1 capitalize">{weather.condition}</p>
        </div>
        <div className="w-10 h-10 rounded-xl bg-sky-200/70 flex items-center justify-center mt-0.5">
          <Icon className="w-5 h-5 text-sky-600" />
        </div>
      </div>