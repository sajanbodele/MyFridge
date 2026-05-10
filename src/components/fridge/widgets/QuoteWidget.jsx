import React, { useState, useEffect } from 'react';
import Magnet from '../Magnet';
import { Sparkles, RefreshCw, Minimize2 } from 'lucide-react';

const quotes = [
  { text: "The only way to do great work is to love what you do.", author: "Steve Jobs" },
  { text: "Stay hungry, stay foolish.", author: "Steve Jobs" },
  { text: "Life is what happens when you're busy making other plans.", author: "John Lennon" },
  { text: "The future belongs to those who believe in the beauty of their dreams.", author: "Eleanor Roosevelt" },
  { text: "Be yourself; everyone else is already taken.", author: "Oscar Wilde" },
  { text: "In the middle of difficulty lies opportunity.", author: "Albert Einstein" },
  { text: "Happiness is not something ready made. It comes from your own actions.", author: "Dalai Lama" },
  { text: "The best time to plant a tree was 20 years ago. The second best time is now.", author: "Chinese Proverb" },
  { text: "Do what you can, with what you have, where you are.", author: "Theodore Roosevelt" },
  { text: "Everything you've ever wanted is on the other side of fear.", author: "George Addair" }
];

const themeColors = {
  default: { bg: 'from-amber-50 via-orange-50 to-yellow-50', accent: 'amber', border: 'amber-200/50' },
  midnight: { bg: 'from-slate-100 via-indigo-50 to-slate-100', accent: 'indigo', border: 'indigo-200/50' },
  sunset: { bg: 'from-rose-50 via-orange-50 to-amber-50', accent: 'rose', border: 'rose-200/50' },
  ocean: { bg: 'from-cyan-50 via-blue-50 to-sky-50', accent: 'cyan', border: 'cyan-200/50' },
  forest: { bg: 'from-emerald-50 via-green-50 to-teal-50', accent: 'emerald', border: 'emerald-200/50' },
  candy: { bg: 'from-pink-50 via-fuchsia-50 to-purple-50', accent: 'pink', border: 'pink-200/50' }
};