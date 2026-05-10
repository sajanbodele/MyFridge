import React from 'react';
import { Pin } from 'lucide-react';

const noteColors = {
  yellow: { bg: 'from-yellow-100 via-yellow-200 to-yellow-300', pin: 'text-red-500' },
  pink: { bg: 'from-pink-100 via-pink-200 to-pink-300', pin: 'text-pink-600' },
  blue: { bg: 'from-sky-100 via-sky-200 to-sky-300', pin: 'text-blue-600' },
  green: { bg: 'from-emerald-100 via-emerald-200 to-emerald-300', pin: 'text-emerald-600' },
  purple: { bg: 'from-violet-100 via-violet-200 to-violet-300', pin: 'text-violet-600' },
  orange: { bg: 'from-orange-100 via-orange-200 to-orange-300', pin: 'text-orange-600' }
};

export default function StickyNote({ 
  content = '', 
  color = 'yellow', 
  isDragging = false,
  onEdit,
  className = ''
}) {
  const colorConfig = noteColors[color] || noteColors.yellow;

  return (
    <div 
      className={`
        relative w-40 md:w-48 
        ${className}
        ${isDragging ? 'scale-105 z-50 rotate-2' : 'hover:scale-102 hover:-rotate-1'}
        transition-all duration-300
      `}
    >
      {/* Note shadow - more realistic */}
      <div className="absolute inset-0 bg-gradient-to-br from-black/0 via-black/10 to-black/25 blur-lg translate-y-3 translate-x-2 rounded-sm" />
      
      {/* Note body */}
      <div className={`
        relative w-full min-h-[140px] md:min-h-[160px]
        bg-gradient-to-br ${colorConfig.bg}
        rounded-sm
        shadow-xl
      `}>
        {/* Push pin */}
        <div className="absolute -top-2 left-1/2 -translate-x-1/2 z-20">
          <div className="relative">
            <div className={`w-5 h-5 rounded-full bg-gradient-to-br from-red-400 to-red-600 shadow-lg`} />
            <div className="absolute inset-0 rounded-full bg-gradient-to-br from-white/40 to-transparent" />
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-1.5 h-1.5 rounded-full bg-red-800" />
          </div>
        </div>
        
        {/* Paper texture overlay */}
        <div className="absolute inset-0 opacity-40 bg-[url('data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSI0IiBoZWlnaHQ9IjQiPjxyZWN0IHdpZHRoPSI0IiBoZWlnaHQ9IjQiIGZpbGw9IiNmZmYiLz48Y2lyY2xlIGN4PSIyIiBjeT0iMiIgcj0iMC41IiBmaWxsPSIjZTVlN2ViIi8+PC9zdmc+')] rounded-sm" />
        
        {/* Top highlight */}
        <div className="absolute top-0 inset-x-0 h-8 bg-gradient-to-b from-white/30 to-transparent rounded-t-sm" />
        
        {/* Corner curl effect - more prominent */}
        <div className="absolute bottom-0 right-0 w-8 h-8 overflow-hidden">
          <div className="absolute bottom-0 right-0 w-12 h-12 bg-gradient-to-tl from-black/20 via-black/10 to-transparent origin-bottom-right -rotate-12" />
          <div className="absolute bottom-0.5 right-0.5 w-5 h-5 bg-white/60 rounded-tl-lg shadow-[-3px_-3px_6px_rgba(0,0,0,0.1)]" />
        </div>
        
        {/* Content area */}
        <div className="p-4 pt-5 relative z-10">
          {/* Content */}
          <div 
            className="text-gray-700 text-sm leading-relaxed whitespace-pre-wrap break-words cursor-pointer min-h-[80px]"
            onClick={onEdit}
            style={{ fontFamily: "'Caveat', 'Segoe Script', cursive", fontSize: '16px', lineHeight: '1.6' }}
          >
            {content || 'Click to add a note...'}
          </div>
        </div>
        
        {/* Subtle lines */}
        <div className="absolute inset-x-4 top-12 bottom-4 pointer-events-none opacity-30">
          {[...Array(5)].map((_, i) => (
            <div 
              key={i} 
              className="w-full h-px bg-gray-500/30 mt-5"
            />
          ))}
        </div>
      </div>
    </div>
  );
}