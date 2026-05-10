import React, { useState, useRef, useCallback } from 'react';
import { Pin, PinOff, Trash2, Copy, Edit3, ExternalLink } from 'lucide-react';

const NOTE_COLORS = {
  yellow: { bg: 'bg-yellow-200', border: 'border-yellow-300', text: 'text-yellow-900', tape: 'bg-yellow-400/40' },
  blue:   { bg: 'bg-blue-100',   border: 'border-blue-200',   text: 'text-blue-900',   tape: 'bg-blue-300/40' },
  green:  { bg: 'bg-green-100',  border: 'border-green-200',  text: 'text-green-900',  tape: 'bg-green-300/40' },
  pink:   { bg: 'bg-pink-100',   border: 'border-pink-200',   text: 'text-pink-900',   tape: 'bg-pink-300/40' },
  purple: { bg: 'bg-purple-100', border: 'border-purple-200', text: 'text-purple-900', tape: 'bg-purple-300/40' },
  orange: { bg: 'bg-orange-100', border: 'border-orange-200', text: 'text-orange-900', tape: 'bg-orange-300/40' },
};

const MAGNET_COLORS = {
  red:    'bg-red-500',
  blue:   'bg-blue-500',
  green:  'bg-green-500',
  yellow: 'bg-yellow-400',
  purple: 'bg-purple-500',
  pink:   'bg-pink-500',
  orange: 'bg-orange-500',
  teal:   'bg-teal-500',
};

function Magnet({ color = 'red' }) {
  return (
    <div className={`w-4 h-4 rounded-full ${MAGNET_COLORS[color] || 'bg-red-500'} pin-shadow absolute -top-2 left-1/2 -translate-x-1/2 z-10 border-2 border-white/40`} />