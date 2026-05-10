import React, { useState, useRef, useEffect, useCallback } from 'react';
import { X, StickyNote, Link2, Image, Smile, Pencil, Check, ChevronLeft, Upload, CheckSquare, Clock, List } from 'lucide-react';

const ITEM_TYPES = [
  { id: 'sticky_note', label: 'Note',    icon: StickyNote, color: 'bg-yellow-50 border-yellow-200 text-yellow-700 hover:bg-yellow-100',  desc: 'To-do, reminder, message' },
  { id: 'link',        label: 'Link / Info', icon: Link2,  color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',           desc: 'URL, bill, contact, menu' },
  { id: 'photo',       label: 'Photo',   icon: Image,      color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',        desc: 'Photo, artwork, memory' },
  { id: 'sticker',     label: 'Sticker', icon: Smile,      color: 'bg-pink-50 border-pink-200 text-pink-700 hover:bg-pink-100',            desc: 'Magnet, decoration' },
  { id: 'drawing',     label: 'Drawing', icon: Pencil,     color: 'bg-purple-50 border-purple-200 text-purple-700 hover:bg-purple-100',    desc: 'Sketch, doodle' },
];

const NOTE_COLORS = ['yellow', 'blue', 'green', 'pink', 'purple', 'orange'];
const NOTE_COLOR_MAP = {
  yellow: '#FEF08A', blue: '#BAE6FD', green: '#A7F3D0',
  pink: '#FBCFE8', purple: '#DDD6FE', orange: '#FED7AA',
};

const STICKER_OPTIONS = ['⭐','❤️','🔥','✨','🎉','📌','💡','🌟','🎯','🌈','🦋','🌸','🍀','⚡','💫','🎨','🏆','🎵','😊','🐶','🍕','☀️','🌙','🎸'];

const SIZE_OPTIONS = [
  { id: 'small', label: 'S', title: 'Small' },
  { id: 'medium', label: 'M', title: 'Medium' },
  { id: 'large', label: 'L', title: 'Large' },
];