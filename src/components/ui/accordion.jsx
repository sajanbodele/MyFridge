import React, { useState, useEffect } from 'react';
import {
  Search, Plus, Sparkles, Settings, X, Eye, EyeOff
} from 'lucide-react';

function LiveClock() {
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);
  const time = now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const date = now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' });
  return (
    <div className="flex flex-col items-end">
      <span className="text-sm font-semibold text-foreground tabular-nums leading-none">{time}</span>
      <span className="text-[11px] text-muted-foreground leading-none mt-0.5">{date}</span>
    </div>
  );
}

export default function TopBar({
  onAddItem,
  onToggleFocus,
  focusMode,
  onOpenAssistant,