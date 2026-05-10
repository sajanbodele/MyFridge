import React, { useState, useRef, useEffect } from 'react';

export default function DraggableItem({ 
  children, 
  initialX = 50, 
  initialY = 50,
  rotation = 0,
  onPositionChange,
  onContextMenu,
  onDoubleClick,
  enablePhysics = true,
  id,
  className = ''
}) {
  const [position, setPosition] = useState({ x: initialX, y: initialY });
  const [isDragging, setIsDragging] = useState(false);
  const [wobble, setWobble] = useState(0);
  const elementRef = useRef(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const clickCount = useRef(0);
  const clickTimer = useRef(null);
  const longPressTimer = useRef(null);

  useEffect(() => {
    setPosition({ x: initialX, y: initialY });
  }, [initialX, initialY]);

  const handleMouseDown = (e) => {
    if (e.button !== 0) return; // Only left click
    e.preventDefault();
    
    const rect = elementRef.current.getBoundingClientRect();
    
    dragOffset.current = {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    };
    
    // Start long press timer
    longPressTimer.current = setTimeout(() => {
      if (onDoubleClick) onDoubleClick();
    }, 500);
    
    setIsDragging(true);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    
    const parentRect = elementRef.current.parentElement.getBoundingClientRect();
    const newX = ((e.clientX - parentRect.left - dragOffset.current.x) / parentRect.width) * 100;
    const newY = ((e.clientY - parentRect.top - dragOffset.current.y) / parentRect.height) * 100;
    
    // Constrain to parent bounds
    const constrainedX = Math.max(0, Math.min(90, newX));
    const constrainedY = Math.max(0, Math.min(90, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };

  const handleMouseUp = () => {
    // Clear long press timer
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    
    if (isDragging) {
      setIsDragging(false);
      
      // Wobble effect when dropped
      if (enablePhysics) {
        setWobble(1);
        setTimeout(() => setWobble(0), 300);
      }
      
      // Notify parent of position change
      if (onPositionChange) {
        onPositionChange(id, position.x, position.y);
      }
    }
  };

  const handleClick = (e) => {
    clickCount.current += 1;
    
    if (clickCount.current === 1) {
      clickTimer.current = setTimeout(() => {
        clickCount.current = 0;
      }, 300);
    } else if (clickCount.current === 2) {
      clearTimeout(clickTimer.current);
      clickCount.current = 0;
      if (onDoubleClick) onDoubleClick();
    }
  };

  useEffect(() => {
    if (isDragging) {
      window.addEventListener('mousemove', handleMouseMove);
      window.addEventListener('mouseup', handleMouseUp);
      return () => {
        window.removeEventListener('mousemove', handleMouseMove);
        window.removeEventListener('mouseup', handleMouseUp);
      };
    }
  }, [isDragging]);

  // Touch support
  const handleTouchStart = (e) => {
    const touch = e.touches[0];
    const rect = elementRef.current.getBoundingClientRect();
    
    dragOffset.current = {
      x: touch.clientX - rect.left,
      y: touch.clientY - rect.top
    };
    
    // Start long press timer for touch
    longPressTimer.current = setTimeout(() => {
      if (onDoubleClick) onDoubleClick();
    }, 500);
    
    setIsDragging(true);
  };

  const handleTouchMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    
    const touch = e.touches[0];
    const parentRect = elementRef.current.parentElement.getBoundingClientRect();
    const newX = ((touch.clientX - parentRect.left - dragOffset.current.x) / parentRect.width) * 100;
    const newY = ((touch.clientY - parentRect.top - dragOffset.current.y) / parentRect.height) * 100;
    
    const constrainedX = Math.max(0, Math.min(90, newX));
    const constrainedY = Math.max(0, Math.min(90, newY));
    
    setPosition({ x: constrainedX, y: constrainedY });
  };

  const handleTouchEnd = () => {
    if (longPressTimer.current) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
    handleMouseUp();
  };

  return (
    <div
      ref={elementRef}
      className={`
        absolute cursor-grab
        ${isDragging ? 'cursor-grabbing z-50' : ''}
        ${wobble ? 'animate-wiggle' : ''}
        transition-transform
        ${className}
      `}
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: `rotate(${rotation}deg)`,
        touchAction: 'none'
      }}
      onMouseDown={handleMouseDown}
      onClick={handleClick}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
      onContextMenu={onContextMenu}
    >
      {React.cloneElement(children, { isDragging })}
    </div>
  );
}