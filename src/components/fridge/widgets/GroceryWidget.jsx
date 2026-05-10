import React, { useState } from 'react';
import { Plus, Check, ShoppingCart, X, Minimize2 } from 'lucide-react';

const themeColors = {
  default: { header: 'from-emerald-500 to-green-500', accent: 'emerald', clip: 'from-emerald-400 to-emerald-600' },
  midnight: { header: 'from-slate-600 to-slate-700', accent: 'indigo', clip: 'from-indigo-400 to-indigo-600' },
  sunset: { header: 'from-orange-500 to-rose-500', accent: 'rose', clip: 'from-rose-400 to-rose-600' },
  ocean: { header: 'from-cyan-500 to-blue-500', accent: 'cyan', clip: 'from-cyan-400 to-cyan-600' },
  forest: { header: 'from-green-600 to-teal-600', accent: 'teal', clip: 'from-teal-400 to-teal-600' },
  candy: { header: 'from-pink-500 to-fuchsia-500', accent: 'pink', clip: 'from-pink-400 to-pink-600' }
};

export default function GroceryWidget({ isDragging = false, onMinimize, theme = 'default' }) {
  const colors = themeColors[theme] || themeColors.default;
  const [items, setItems] = useState([
    { id: 1, text: 'Milk', checked: false },
    { id: 2, text: 'Eggs', checked: true },
    { id: 3, text: 'Bread', checked: false },
  ]);
  const [newItem, setNewItem] = useState('');
  const [isAdding, setIsAdding] = useState(false);
  const [animatingId, setAnimatingId] = useState(null);

  const toggleItem = (id) => {
    setAnimatingId(id);
    setTimeout(() => setAnimatingId(null), 300);