import React from 'react';
import Magnet from './Magnet';

export default function BookmarkMagnet({ 
  url, 
  title, 
  magnetColor = 'red',
  magnetShape = 'circle',
  letter,
  isDragging = false,
  onClick,
  onContextMenu
}) {
  const handleClick = () => {
    if (onClick) onClick();
    else if (url) window.open(url, '_blank');
  };

  const displayLetter = letter || (title ? title[0].toUpperCase() : 'B');

  return (
    <div 
      className={`
        group relative cursor-pointer
        ${isDragging ? 'scale-110 z-50' : 'hover:scale-105'}
        transition-all duration-200
      `}
      onClick={handleClick}
      onContextMenu={onContextMenu}
    >
      {/* Main magnet */}
      <Magnet 
        shape={magnetShape} 
        color={magnetColor} 
        letter={displayLetter}
        size="md"
        isDragging={isDragging}
      />
      
      {/* Tooltip */}
      <div className="
        absolute -bottom-8 left-1/2 -translate-x-1/2
        px-2 py-1 rounded bg-gray-900/90 text-white text-xs
        whitespace-nowrap max-w-[120px] truncate
        opacity-0 group-hover:opacity-100
        transition-opacity duration-200
        pointer-events-none z-50
      ">
        {title || url}
      </div>
    </div>
  );
}