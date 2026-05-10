import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Minimize2 } from 'lucide-react';

const themeColors = {
  default: { body: 'from-red-400 via-red-500 to-red-600', accent: 'red-500' },
  midnight: { body: 'from-slate-700 via-slate-800 to-slate-900', accent: 'indigo-400' },
  sunset: { body: 'from-orange-400 via-rose-500 to-pink-600', accent: 'amber-400' },
  ocean: { body: 'from-cyan-400 via-blue-500 to-indigo-600', accent: 'cyan-400' },
  forest: { body: 'from-emerald-400 via-green-500 to-teal-600', accent: 'lime-400' },
  candy: { body: 'from-pink-400 via-fuchsia-500 to-purple-600', accent: 'pink-300' }
};

export default function ClockWidget({ isDragging = false, onMinimize, theme = 'default' }) {
  const colors = themeColors[theme] || themeColors.default;
  const [time, setTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const hours = time.getHours() % 12;
  const minutes = time.getMinutes();
  const seconds = time.getSeconds();