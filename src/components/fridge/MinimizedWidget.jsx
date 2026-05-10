import React from 'react';
import { Clock, Cloud, Calendar, MessageSquareQuote, ShoppingCart, CheckSquare, Images, Music, Tv, Calculator, PenTool, CloudSun } from 'lucide-react';

const widgetIcons = {
  clock: Clock,
  weather: Cloud,
  calendar: Calendar,
  quote: MessageSquareQuote,
  grocery: ShoppingCart,
  todo: CheckSquare,
  slideshow: Images,
  music: Music,
  smart_tv: Tv,
  calculator: Calculator,
  whiteboard: PenTool,
  realtime_weather: CloudSun
};

const widgetColors = {
  clock: 'from-amber-400 to-orange-500',
  weather: 'from-sky-400 to-blue-500',
  calendar: 'from-rose-400 to-pink-500',
  quote: 'from-violet-400 to-purple-500',
  grocery: 'from-emerald-400 to-green-500',
  todo: 'from-cyan-400 to-teal-500',
  slideshow: 'from-fuchsia-400 to-pink-500',
  music: 'from-red-400 to-rose-500',
  smart_tv: 'from-slate-500 to-gray-700',
  calculator: 'from-gray-500 to-gray-700',
  whiteboard: 'from-slate-400 to-slate-600',
  realtime_weather: 'from-cyan-400 to-blue-500'
};

const widgetLabels = {
  clock: 'Clock',
  weather: 'Weather',
  calendar: 'Calendar',
  quote: 'Quotes',
  grocery: 'Grocery',
  todo: 'To-Do',
  slideshow: 'Photos',
  music: 'Music',
  smart_tv: 'Smart TV',
  calculator: 'Calculator',
  whiteboard: 'Whiteboard',
  realtime_weather: 'Live Weather'
};

export default function MinimizedWidget({ 
  widgetType, 
  customIcon,
  onRestore,
  isDragging = false 
}) {
  const Icon = widgetIcons[widgetType] || Clock;
  const gradient = widgetColors[widgetType] || 'from-gray-400 to-gray-500';
  const label = widgetLabels[widgetType] || 'Widget';

  return (
    <div 
      className={`
        group relative cursor-pointer
        ${isDragging ? 'scale-110 z-50' : 'hover:scale-110'}
        transition-all duration-200
      `}
      onDoubleClick={onRestore}
    >
      {/* Magnet body */}
      <div className={`
        w-12 h-12 rounded-xl bg-gradient-to-br ${gradient}
        shadow-lg flex items-center justify-center
        border-2 border-white/30
        relative overflow-hidden
      `}>
        {/* Shine effect */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-transparent" />
        
        {/* Icon or custom emoji */}
        {customIcon ? (
          <span className="text-2xl relative z-10">{customIcon}</span>
        ) : (
          <Icon className="w-6 h-6 text-white relative z-10 drop-shadow" />
        )}

        {/* Magnet hole effect */}
        <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-black/20 rounded-full" />
      </div>

      {/* Tooltip */}
      <div className="
        absolute -bottom-7 left-1/2 -translate-x-1/2
        px-2 py-0.5 rounded bg-gray-900/90 text-white text-xs
        whitespace-nowrap
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none z-50
      ">
        {label}
      </div>

      {/* Restore hint */}
      <div className="
        absolute -top-6 left-1/2 -translate-x-1/2
        text-xs text-gray-600 bg-white/90 px-1.5 py-0.5 rounded shadow
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none whitespace-nowrap
      ">
        Double-click to restore
      </div>
    </div>
  );
}