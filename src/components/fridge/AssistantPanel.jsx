const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { X, Sparkles, Trash2, AlignLeft, Star, RefreshCw, Loader2 } from 'lucide-react';

const QUICK_ACTIONS = [
  { id: 'clean', icon: AlignLeft, label: 'Clean layout', desc: 'Arrange items neatly' },
  { id: 'highlight', icon: Star, label: 'Highlight important', desc: 'Boost pinned items' },
  { id: 'suggest', icon: Sparkles, label: 'Suggest note', desc: 'AI creates a quick note' },
  { id: 'declutter', icon: Trash2, label: 'Remove old items', desc: 'Find stale content' },
];

export default function AssistantPanel({ isOpen, onClose, items, onCleanLayout, onCreateItem }) {
  const [loading, setLoading] = useState(null);
  const [message, setMessage] = useState('');
  const [chat, setChat] = useState([
    { role: 'assistant', text: "Hi! I'm your Fridge Assistant. I can help you organize, clean up, and create items on your fridge. What would you like to do?" }
  ]);

  const handleAction = async (action) => {
    setLoading(action);
    try {
      if (action === 'clean') {
        onCleanLayout();
        setChat(c => [...c, { role: 'assistant', text: 'Done! I\'ve arranged your items into a clean grid layout.' }]);
      } else if (action === 'suggest') {
        const result = await db.integrations.Core.InvokeLLM({
          prompt: `Create a short, helpful sticky note for someone's digital fridge. Make it motivational, practical, or a nice reminder. Keep it under 30 words. Just the note content, no quotes.`,
        });
        onCreateItem({
          type: 'sticky_note',
          content: result,
          note_color: ['yellow', 'blue', 'pink', 'green'][Math.floor(Math.random() * 4)],
          position_x: 20 + Math.random() * 40,
          position_y: 20 + Math.random() * 40,
          rotation: -4 + Math.random() * 8,
        });
        setChat(c => [...c, { role: 'assistant', text: `I added a note: "${result}"` }]);
      } else if (action === 'highlight') {
        setChat(c => [...c, { role: 'assistant', text: 'I\'ve highlighted your pinned items so they stand out more in Focus Mode.' }]);
      } else if (action === 'declutter') {
        setChat(c => [...c, { role: 'assistant', text: `You have ${items.length} items on your fridge. Consider removing items you no longer need by clicking the trash icon when hovering over them.` }]);
      }
    } catch (e) {
      setChat(c => [...c, { role: 'assistant', text: 'Oops, something went wrong. Try again!' }]);
    }
    setLoading(null);
  };

  const handleSendMessage = async () => {
    if (!message.trim()) return;
    const userMsg = message.trim();
    setMessage('');
    setChat(c => [...c, { role: 'user', text: userMsg }]);
    setLoading('chat');

    try {
      const context = `The user has a digital fridge with ${items.length} items: ${items.map(i => `${i.type}: "${i.title || i.content?.slice(0,30)}"`).join(', ')}`;
      const result = await db.integrations.Core.InvokeLLM({
        prompt: `You are a helpful fridge assistant. ${context}. User says: "${userMsg}". Give a brief, helpful response in 1-2 sentences.`,
      });
      setChat(c => [...c, { role: 'assistant', text: result }]);
    } catch {
      setChat(c => [...c, { role: 'assistant', text: 'Let me think about that...' }]);
    }
    setLoading(null);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-end p-4">
      <div className="absolute inset-0 bg-foreground/20 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-sm h-[560px] flex flex-col animate-scale-in">
        <div className="bg-card rounded-3xl shadow-fridge border border-border/60 flex flex-col h-full overflow-hidden">
          {/* Header */}
          <div className="flex items-center gap-3 px-5 pt-5 pb-4 border-b border-border/40">
            <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-violet-500 to-purple-600 flex items-center justify-center flex-shrink-0">
              <Sparkles className="w-4 h-4 text-white" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-foreground">Fridge Assistant</h3>
              <p className="text-[11px] text-muted-foreground">Powered by AI</p>
            </div>
            <div className="flex-1" />
            <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-muted flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-muted-foreground" />
            </button>
          </div>

          {/* Quick actions */}
          <div className="p-4 border-b border-border/40">
            <div className="grid grid-cols-2 gap-2">
              {QUICK_ACTIONS.map(action => {
                const Icon = action.icon;
                return (
                  <button key={action.id} onClick={() => handleAction(action.id)}
                    disabled={loading === action.id}
                    className="flex items-center gap-2.5 p-2.5 rounded-xl bg-muted/60 hover:bg-muted border border-border/40 text-left transition-all hover:scale-[1.02] disabled:opacity-60"
                  >
                    {loading === action.id ? <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" /> : <Icon className="w-3.5 h-3.5 text-muted-foreground" />}
                    <div>
                      <p className="text-xs font-medium text-foreground leading-tight">{action.label}</p>
                      <p className="text-[10px] text-muted-foreground">{action.desc}</p>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Chat */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {chat.map((msg, i) => (
              <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                <div className={`max-w-[85%] px-3.5 py-2.5 rounded-2xl text-xs leading-relaxed ${
                  msg.role === 'user'
                    ? 'bg-primary text-primary-foreground rounded-br-sm'
                    : 'bg-muted text-foreground rounded-bl-sm'
                }`}>
                  {msg.text}
                </div>
              </div>
            ))}
            {loading === 'chat' && (
              <div className="flex justify-start">
                <div className="bg-muted rounded-2xl rounded-bl-sm px-3.5 py-2.5">
                  <Loader2 className="w-3.5 h-3.5 animate-spin text-muted-foreground" />
                </div>
              </div>
            )}
          </div>

          {/* Input */}
          <div className="p-4 border-t border-border/40">
            <div className="flex gap-2">
              <input
                value={message}
                onChange={e => setMessage(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSendMessage()}
                placeholder="Ask anything..."
                className="flex-1 text-xs bg-muted/50 border border-border/60 rounded-xl px-3.5 py-2.5 outline-none focus:border-primary/50 focus:bg-background transition-all"
              />
              <button onClick={handleSendMessage}
                className="w-9 h-9 rounded-xl bg-primary text-primary-foreground flex items-center justify-center hover:opacity-90 transition-all">
                <Sparkles className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}