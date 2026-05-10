import React, { useState, useEffect } from 'react';
import { Play, Pause, SkipBack, SkipForward, Volume2, Music, Radio, Minimize2 } from 'lucide-react';

const streamingServices = [
  { id: 'spotify', name: 'Spotify', color: 'bg-[#1DB954]', url: 'https://open.spotify.com' },
  { id: 'apple', name: 'Apple', color: 'bg-[#FA243C]', url: 'https://music.apple.com' },
  { id: 'youtube', name: 'YT Music', color: 'bg-[#FF0000]', url: 'https://music.youtube.com' },
];

const radioStations = [
  { id: 1, name: 'Lofi Beats', genre: 'Chill' },
  { id: 2, name: 'Smooth Jazz', genre: 'Jazz' },
  { id: 3, name: 'Classical Piano', genre: 'Classical' },
  { id: 4, name: 'Indie Mix', genre: 'Indie' },
];

const themeColors = {
  default: { header: 'from-stone-800 via-stone-900 to-neutral-900', accent: 'amber' },
  midnight: { header: 'from-slate-800 via-indigo-900 to-slate-900', accent: 'indigo' },
  sunset: { header: 'from-orange-800 via-rose-900 to-pink-900', accent: 'rose' },
  ocean: { header: 'from-cyan-800 via-blue-900 to-indigo-900', accent: 'cyan' },
  forest: { header: 'from-emerald-800 via-green-900 to-teal-900', accent: 'emerald' },
  candy: { header: 'from-pink-700 via-fuchsia-800 to-purple-900', accent: 'pink' }
};

export default function MusicPlayer({ isDragging = false, onMinimize, theme = 'default' }) {