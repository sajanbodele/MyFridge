import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Pause, ImagePlus, X, Images, Minimize2, Upload, Trash2, Settings } from 'lucide-react';

const defaultPhotos = [
  { id: 1, url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400', caption: 'Mountains' },
  { id: 2, url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400', caption: 'Beach Sunset' },
  { id: 3, url: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400', caption: 'Forest Path' },
  { id: 4, url: 'https://images.unsplash.com/photo-1682687220742-aba13b6e50ba?w=400', caption: 'Nature' },
];

const themeColors = {
  default: { header: 'from-rose-500 to-pink-500', clip: 'from-rose-400 to-rose-600' },
  midnight: { header: 'from-slate-600 to-slate-700', clip: 'from-slate-500 to-slate-700' },
  sunset: { header: 'from-orange-500 to-amber-500', clip: 'from-orange-400 to-orange-600' },
  ocean: { header: 'from-cyan-500 to-blue-500', clip: 'from-cyan-400 to-cyan-600' },
  forest: { header: 'from-emerald-500 to-teal-500', clip: 'from-emerald-400 to-emerald-600' },
  candy: { header: 'from-pink-400 to-fuchsia-500', clip: 'from-pink-400 to-pink-600' }
};

export default function PhotoSlideshow({ isDragging = false, onMinimize, theme = 'default' }) {
  const colors = themeColors[theme] || themeColors.default;
  const [photos, setPhotos] = useState(defaultPhotos);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [showAddForm, setShowAddForm] = useState(false);