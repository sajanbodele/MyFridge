import React, { useState, useEffect, useRef } from 'react';
import { X, Trash2, Copy, Pin, PinOff, Save, ChevronUp, ChevronDown, List, Upload } from 'lucide-react';

const NOTE_COLORS = ['yellow', 'blue', 'green', 'pink', 'purple', 'orange'];
const NOTE_COLOR_MAP = {
  yellow: ' #FEF08A', blue: ' #BAE6FD', green: ' #A7F3D0',
  pink: ' #FBCFE8', purple: ' #DDD6FE', orange: ' #FED7AA',
};

const STICKER_OPTIONS = ['⭐','❤️','🔥','✨','🎉','📌','💡','🌟','🎯','🌈','🦋','🌸','🍀','⚡','💫','🎨','🏆','🎵','😊','🐶','🍕','☀️','🌙','🎸'];

const SIZE_OPTIONS = [
  { id: 'small', label: 'S' },
  { id: 'medium', label: 'M' },
  { id: 'large', label: 'L' },
];

const TYPE_ICONS = {
  sticky_note: '📝',
  link: '🔗',
  photo: '📷',
  sticker: '✨',
  drawing: '🎨',
  bookmark: '🔖',
};