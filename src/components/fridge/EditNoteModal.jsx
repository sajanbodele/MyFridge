import React, { useState, useEffect } from 'react';
import { X, Trash2, Link2, Image, StickyNote } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const magnetColors = ['red', 'blue', 'yellow', 'green', 'pink', 'purple', 'orange', 'cyan', 'rose', 'indigo', 'teal', 'lime', 'gold', 'silver', 'rainbow'];
const magnetShapes = ['circle', 'star', 'heart', 'square', 'diamond', 'hexagon', 'cloud', 'flower', 'fruit_apple', 'fruit_orange', 'fruit_cherry', 'bottle_cap', 'letter'];
const noteColors = ['yellow', 'pink', 'blue', 'green', 'purple', 'orange'];

const colorMap = {
  yellow: '#FEF08A',
  pink: '#FBCFE8',
  blue: '#BAE6FD',
  green: '#A7F3D0',
  purple: '#DDD6FE',
  orange: '#FED7AA',
  red: '#EF4444',
};

const magnetColorMap = {
  red: '#EF4444', blue: '#3B82F6', yellow: '#F59E0B', green: '#22C55E',
  pink: '#EC4899', purple: '#8B5CF6', orange: '#F97316', cyan: '#06B6D4',
  rose: '#F43F5E', indigo: '#6366F1', teal: '#14B8A6', lime: '#84CC16',
  gold: '#D97706', silver: '#64748B', rainbow: 'linear-gradient(90deg, #EF4444, #F59E0B, #3B82F6)'