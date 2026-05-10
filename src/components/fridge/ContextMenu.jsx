import React, { useEffect, useRef } from 'react';
import { Pencil, Copy, Trash2, Lock, MoveUp, MoveDown, Palette } from 'lucide-react';

export default function ContextMenu({ 
  x, 
  y, 
  onClose, 
  onEdit, 
  onDuplicate, 
  onDelete, 
  onMoveToFront,
  onMoveToBack 
}) {
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        onClose();
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [onClose]);

  const menuItems = [