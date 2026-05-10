import React, { useState } from 'react';
import { Plus, Check, X, ListTodo, Circle, Minimize2 } from 'lucide-react';

const themeColors = {
  default: { header: 'from-indigo-500 to-purple-500', accent: 'indigo', clip: 'from-indigo-400 to-indigo-600' },
  midnight: { header: 'from-slate-600 to-slate-700', accent: 'slate', clip: 'from-slate-500 to-slate-700' },
  sunset: { header: 'from-orange-500 to-rose-500', accent: 'rose', clip: 'from-rose-400 to-rose-600' },
  ocean: { header: 'from-cyan-500 to-blue-500', accent: 'blue', clip: 'from-blue-400 to-blue-600' },
  forest: { header: 'from-emerald-500 to-teal-500', accent: 'emerald', clip: 'from-emerald-400 to-emerald-600' },
  candy: { header: 'from-pink-500 to-fuchsia-500', accent: 'pink', clip: 'from-pink-400 to-pink-600' }
};

export default function TodoWidget({ isDragging = false, onMinimize, theme = 'default' }) {
  const colors = themeColors[theme] || themeColors.default;
  const [todos, setTodos] = useState([
    { id: 1, text: 'Call mom', done: false, priority: 'high' },
    { id: 2, text: 'Buy groceries', done: true, priority: 'medium' },
    { id: 3, text: 'Finish project', done: false, priority: 'high' },
  ]);
  const [newTodo, setNewTodo] = useState('');
  const [isAdding, setIsAdding] = useState(false);

  const toggleTodo = (id) => {
    setTodos(todos.map(t => t.id === id ? { ...t, done: !t.done } : t));
  };