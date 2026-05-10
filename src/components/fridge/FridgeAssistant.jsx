import React, { useState } from 'react';
import { X, Sparkles, Wand2, Layers, Calendar, Star, LayoutGrid, Send, CheckCircle2 } from 'lucide-react';

const QUICK_ACTIONS = [
  {
    id: 'clean',
    icon: Wand2,
    label: 'Clean My Fridge',
    desc: 'Align items, reduce overlap, improve spacing',
    color: 'bg-violet-50 border-violet-200 text-violet-700 hover:bg-violet-100',
    iconColor: 'text-violet-500',
  },
  {
    id: 'group',
    icon: Layers,
    label: 'Group Similar Items',
    desc: 'Cluster notes, links, and photos together',
    color: 'bg-blue-50 border-blue-200 text-blue-700 hover:bg-blue-100',
    iconColor: 'text-blue-500',
  },
  {
    id: 'today',
    icon: Calendar,
    label: 'Show Only Today',
    desc: 'Show only today\'s items, hide others',
    color: 'bg-green-50 border-green-200 text-green-700 hover:bg-green-100',
    iconColor: 'text-green-500',
  },
  {
    id: 'highlight',
    icon: Star,
    label: 'Highlight Important',
    desc: 'Emphasize pinned and priority items',
    color: 'bg-amber-50 border-amber-200 text-amber-700 hover:bg-amber-100',
    iconColor: 'text-amber-500',
  },
  {
    id: 'organize',
    icon: LayoutGrid,
    label: 'Organize by Type',
    desc: 'Separate notes, links, and photos visually',
    color: 'bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100',
    iconColor: 'text-rose-500',
  },
];

const SUGGESTIONS = [
  { text: 'Clean up overlapping items', action: 'clean' },
  { text: 'Group my sticky notes', action: 'group' },
  { text: 'Show what I added today', action: 'today' },
];

export default function FridgeAssistant({ isOpen, onClose, onAction }) {
  const [lastAction, setLastAction] = useState(null);
  const [customInput, setCustomInput] = useState('');

  const handleAction = (actionId) => {
    onAction(actionId);
    setLastAction(actionId);
    setTimeout(() => setLastAction(null), 2000);
  };

  const handleSend = () => {
    if (!customInput.trim()) return;
    const lower = customInput.toLowerCase();
    if (lower.includes('clean') || lower.includes('align') || lower.includes('tidy')) handleAction('clean');
    else if (lower.includes('group') || lower.includes('cluster')) handleAction('group');
    else if (lower.includes('today')) handleAction('today');
    else if (lower.includes('highlight') || lower.includes('important') || lower.includes('pin')) handleAction('highlight');
    else if (lower.includes('organize') || lower.includes('type') || lower.includes('sort')) handleAction('organize');
    else handleAction('clean');
    setCustomInput('');
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />

      <div className="relative w-full max-w-sm animate-scale-in">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-violet-600 to-indigo-600 px-5 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-9 h-9 rounded-2xl bg-white/20 flex items-center justify-center">
                  <Sparkles className="w-4.5 h-4.5 text-white" />
                </div>
                <div>
                  <h2 className="font-semibold text-white text-sm">Fridge Assistant</h2>
                  <p className="text-white/60 text-[11px]">One-click fridge magic</p>
                </div>
              </div>
              <button onClick={onClose} className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 flex items-center justify-center transition-colors">
                <X className="w-4 h-4 text-white" />
              </button>
            </div>
          </div>

          <div className="p-4 space-y-4">
            {/* Quick Actions */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2.5">Quick Actions</p>
              <div className="space-y-2">
                {QUICK_ACTIONS.map(({ id, icon: Icon, label, desc, color, iconColor }) => (
                  <button
                    key={id}
                    onClick={() => handleAction(id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-2xl border-2 text-left transition-all hover:scale-[1.01] active:scale-[0.99] ${color} ${lastAction === id ? 'ring-2 ring-offset-1 ring-current' : ''}`}
                  >
                    <div className={`w-8 h-8 rounded-xl bg-white/60 flex items-center justify-center shrink-0 ${iconColor}`}>
                      {lastAction === id
                        ? <CheckCircle2 className="w-4 h-4" />
                        : <Icon className="w-4 h-4" />
                      }
                    </div>
                    <div className="min-w-0">
                      <p className="text-xs font-semibold leading-tight">{label}</p>
                      <p className="text-[10px] opacity-60 mt-0.5 leading-snug truncate">{desc}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Suggestions */}
            <div>
              <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-2">Suggestions</p>
              <div className="flex flex-wrap gap-1.5">
                {SUGGESTIONS.map(({ text, action }) => (
                  <button
                    key={text}
                    onClick={() => handleAction(action)}
                    className="text-[11px] px-2.5 py-1 bg-gray-100 hover:bg-gray-200 text-gray-600 rounded-full transition-colors"
                  >
                    {text}
                  </button>
                ))}
              </div>
            </div>

            {/* Text input */}
            <div className="flex gap-2 pt-1">
              <input
                type="text"
                value={customInput}
                onChange={e => setCustomInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSend()}
                placeholder="Type a command..."
                className="flex-1 text-sm bg-gray-100 rounded-xl px-3.5 py-2 outline-none focus:ring-2 focus:ring-violet-400 placeholder:text-gray-400"
              />
              <button
                onClick={handleSend}
                disabled={!customInput.trim()}
                className="p-2 bg-violet-600 text-white rounded-xl hover:bg-violet-700 disabled:opacity-40 transition-all"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}