import React from 'react';
import { Users } from 'lucide-react';

export default function CollaboratorAvatars({ collaborators = [], owner, currentUser, maxVisible = 3 }) {
  const allUsers = [owner, ...collaborators].filter(Boolean);
  const uniqueUsers = [...new Set(allUsers)];
  const visible = uniqueUsers.slice(0, maxVisible);
  const overflow = uniqueUsers.length - maxVisible;

  const getInitials = (email) => {
    if (!email) return '?';
    const name = email.split('@')[0];
    return name.slice(0, 2).toUpperCase();
  };

  const getColor = (email) => {
    const colors = [
      'bg-blue-500', 'bg-purple-500', 'bg-pink-500', 'bg-green-500', 
      'bg-amber-500', 'bg-cyan-500', 'bg-rose-500', 'bg-indigo-500'
    ];
    const hash = email?.split('').reduce((a, b) => a + b.charCodeAt(0), 0) || 0;
    return colors[hash % colors.length];
  };

  if (uniqueUsers.length === 0) return null;

  return (
    <div className="flex items-center">
      <div className="flex -space-x-2">
        {visible.map((email, i) => (
          <div
            key={email}
            className={`w-7 h-7 rounded-full ${getColor(email)} flex items-center justify-center text-white text-xs font-medium border-2 border-white shadow-sm`}
            title={email === currentUser ? 'You' : email}
            style={{ zIndex: visible.length - i }}
          >
            {email === currentUser ? '👤' : getInitials(email)}
          </div>
        ))}
        {overflow > 0 && (
          <div className="w-7 h-7 rounded-full bg-gray-400 flex items-center justify-center text-white text-xs font-medium border-2 border-white">
            +{overflow}
          </div>
        )}
      </div>
      <div className="ml-2 flex items-center gap-1 px-2 py-0.5 bg-green-100 rounded-full">
        <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
        <span className="text-xs text-green-700">Live</span>
      </div>
    </div>
  );
}