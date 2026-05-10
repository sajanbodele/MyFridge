import React, { useState } from 'react';
import { Search, ArrowRight } from 'lucide-react';

export default function SearchBar() {
  const [query, setQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      window.open(`https://www.google.com/search?q=${encodeURIComponent(query)}`, '_blank');
      setQuery('');
    }
  };

  return (
    <div className="w-full max-w-md">
      {/* Main search container - magnetic notepad style */}
      <form 
        onSubmit={handleSubmit}
        className={`
          relative rounded-xl shadow-lg transition-all duration-300
          ${isFocused ? 'bg-white ring-2 ring-blue-400/50' : 'bg-white/90'}
          overflow-hidden
        `}
      >