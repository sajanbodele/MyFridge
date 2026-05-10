import React, { useState } from 'react';
import { X, Pin, Clock, Star } from 'lucide-react';

const FOCUS_FILTERS = [
  { id: 'pinned', label: 'Pinned only', icon: Pin },
  { id: 'recent', label: 'Recent', icon: Clock },
  { id: 'today', label: 'Today', icon: Star },
];

export default function FocusModeBar({ onExit, focusFilter, onFilterChange }) {
  return (
    <div className="fixed top-4 left-1/2 -translate-x-1/2 z-40 animate-slide-up">
      <div className="flex items-center gap-2 bg-white/95 backdrop-blur-md border border-gray-200 rounded-2xl shadow-lg px-3 py-2">
        {/* Indicator */}
        <div className="flex items-center gap-1.5 pr-2 border-r border-gray-200">
          <span className="w-2 h-2 rounded-full bg-accent animate-pulse" />
          <span className="text-xs font-semibold text-gray-700">Focus Mode</span>
        </div>

        {/* Filter pills */}
        <div className="flex items-center gap-1">
          {FOCUS_FILTERS.map(f => {
            const Icon = f.icon;
            const active = focusFilter === f.id;
            return (
              <button
                key={f.id}
                onClick={() => onFilterChange(active ? null : f.id)}
                className={`flex items-center gap-1 px-2.5 py-1 rounded-xl text-[11px] font-medium transition-all ${
                  active ? 'bg-primary text-white' : 'text-gray-500 hover:bg-gray-100'
                }`}
              >
                <Icon className="w-3 h-3" />
                {f.label}
              </button>
            );
          })}
        </div>

        {/* Exit */}
        <button
          onClick={onExit}
          className="ml-1 w-6 h-6 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors"
        >
          <X className="w-3.5 h-3.5 text-gray-400" />
        </button>
      </div>
    </div>
  );
}