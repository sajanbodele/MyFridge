import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar, Minimize2 } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameDay, addMonths, subMonths, isToday } from 'date-fns';
import Magnet from '../Magnet';

const themeColors = {
  default: { header: 'from-rose-500 to-pink-500', accent: 'rose' },
  midnight: { header: 'from-slate-600 to-slate-700', accent: 'indigo' },
  sunset: { header: 'from-orange-500 to-amber-500', accent: 'orange' },
  ocean: { header: 'from-cyan-500 to-blue-500', accent: 'cyan' },
  forest: { header: 'from-emerald-500 to-teal-500', accent: 'emerald' },
  candy: { header: 'from-pink-400 to-fuchsia-500', accent: 'pink' }
};

export default function CalendarWidget({ isDragging = false, onMinimize, theme = 'default' }) {
  const colors = themeColors[theme] || themeColors.default;
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(currentMonth);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });
  
  const startDay = monthStart.getDay();

  return (