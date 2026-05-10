import React, { useState, useRef, useEffect } from 'react';
import { PenTool, Minimize2, Trash2, Undo } from 'lucide-react';

const themeColors = {
  default: { header: 'from-slate-500 to-slate-600', board: 'bg-white', border: 'border-slate-300' },
  midnight: { header: 'from-indigo-600 to-slate-700', board: 'bg-slate-100', border: 'border-indigo-300' },
  sunset: { header: 'from-orange-500 to-rose-500', board: 'bg-orange-50', border: 'border-orange-300' },
  ocean: { header: 'from-cyan-500 to-blue-500', board: 'bg-cyan-50', border: 'border-cyan-300' },
  forest: { header: 'from-green-500 to-teal-600', board: 'bg-green-50', border: 'border-green-300' },
  candy: { header: 'from-pink-500 to-fuchsia-500', board: 'bg-pink-50', border: 'border-pink-300' }
};

const penColors = ['#000000', '#EF4444', '#3B82F6', '#22C55E', '#F59E0B', '#8B5CF6'];

export default function WhiteboardWidget({ isDragging = false, onMinimize, theme = 'default' }) {
  const colors = themeColors[theme] || themeColors.default;
  const canvasRef = useRef(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [penColor, setPenColor] = useState('#000000');
  const [brushSize, setBrushSize] = useState(2);
  const [history, setHistory] = useState([]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (canvas) {
      const ctx = canvas.getContext('2d');