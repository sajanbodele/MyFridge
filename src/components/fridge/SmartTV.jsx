const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { X, Play, Pause, Volume2, VolumeX, Maximize2, Plus, Trash2, Tv, Gamepad2, Film, Minimize2, Upload } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export default function SmartTV({ isVisible, onClose, onMinimize }) {
  const [mediaItems, setMediaItems] = useState([
    { id: 1, type: 'video', title: 'Relaxing Fireplace', url: 'https://www.youtube.com/embed/L_LUpnjgPso?autoplay=1' },
    { id: 2, type: 'video', title: 'Aquarium', url: 'https://www.youtube.com/embed/nDqP7kcr-sc?autoplay=1' },
  ]);
  const [currentMedia, setCurrentMedia] = useState(null);
  const [showAddForm, setShowAddForm] = useState(false);
  const [newMedia, setNewMedia] = useState({ title: '', url: '', type: 'video' });
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [isMinimized, setIsMinimized] = useState(false);

  const convertToEmbedUrl = (url) => {
    // YouTube
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\s]+)/);
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1`;
    }
    // Vimeo
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`;
    }
    return url;
  };

  const handleAddMedia = () => {
    if (newMedia.title && newMedia.url) {
      const embedUrl = convertToEmbedUrl(newMedia.url);
      setMediaItems([...mediaItems, { 
        id: Date.now(), 
        ...newMedia, 
        url: embedUrl 
      }]);
      setNewMedia({ title: '', url: '', type: 'video' });
      setShowAddForm(false);
    }
  };

  const handleDeleteMedia = (id) => {
    setMediaItems(mediaItems.filter(m => m.id !== id));
    if (currentMedia?.id === id) setCurrentMedia(null);
  };

  const handleFileUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    setMediaItems([...mediaItems, {
      id: Date.now(),
      type: 'video',
      title: file.name.replace(/\.[^/.]+$/, ''),
      url: file_url,
      isDirectVideo: true
    }]);
    setUploading(false);
  };

  const handleMinimize = () => {
    setIsMinimized(true);
  };

  const handleRestore = () => {
    setIsMinimized(false);
  };

  if (!isVisible) return null;

  // Minimized state - show as magnet
  if (isMinimized) {
    return (
      <div 
        className="absolute top-4 left-4 z-40 cursor-pointer group"
        onClick={handleRestore}
      >
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-slate-600 to-slate-800 shadow-lg flex items-center justify-center border-2 border-white/30 hover:scale-110 transition-transform">
          <Tv className="w-6 h-6 text-cyan-400" />
        </div>
        <div className="absolute -bottom-6 left-1/2 -translate-x-1/2 text-xs bg-gray-900/90 text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap">
          Click to restore
        </div>
      </div>
    );
  }

  return (
    <div className={`
      absolute z-40 transition-all duration-500
      ${isFullscreen 
        ? 'inset-4' 
        : 'top-4 left-4 w-72 md:w-96'
      }
    `}>
      {/* TV Frame */}
      <div className="relative bg-neutral-900 rounded-2xl shadow-2xl overflow-hidden border-2 border-neutral-700">
        {/* Screen bezel effect */}
        <div className="absolute inset-0 rounded-2xl shadow-[inset_0_0_30px_rgba(0,0,0,0.6)] pointer-events-none z-10" />
        
        {/* Header */}
        <div className="bg-neutral-800 px-3 py-2 flex items-center justify-between border-b border-neutral-700">
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.5)]" />
            <span className="text-xs font-medium text-neutral-300">Smart Display</span>
          </div>
          <div className="flex items-center gap-1">
            <button 
              onClick={handleMinimize}
              className="p-1.5 hover:bg-neutral-700 rounded transition-colors"
              title="Minimize to magnet"
            >
              <Minimize2 className="w-3.5 h-3.5 text-neutral-400" />
            </button>
            <button 
              onClick={() => setIsFullscreen(!isFullscreen)}
              className="p-1.5 hover:bg-neutral-700 rounded transition-colors"
            >
              <Maximize2 className="w-3.5 h-3.5 text-neutral-400" />
            </button>
            <button 
              onClick={onClose}
              className="p-1.5 hover:bg-neutral-700 rounded transition-colors"
            >
              <X className="w-3.5 h-3.5 text-neutral-400" />
            </button>
          </div>
        </div>

        {/* Screen */}
        <div className="bg-black aspect-video">
          {currentMedia ? (
            currentMedia.isDirectVideo ? (
              <video
                src={currentMedia.url}
                className="w-full h-full"
                controls
                autoPlay
                muted={isMuted}
              />
            ) : (
              <iframe
                src={currentMedia.url + (isMuted ? '&mute=1' : '')}
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            )
          ) : (
            <div className="w-full h-full flex flex-col items-center justify-center bg-gradient-to-b from-neutral-900 to-black p-4">
              <div className="w-16 h-16 rounded-full bg-neutral-800/50 flex items-center justify-center mb-3">
                <Tv className="w-8 h-8 text-neutral-600" />
              </div>
              <p className="text-sm text-neutral-500">Select media to play</p>
            </div>
          )}
        </div>

        {/* Controls */}
        {currentMedia && (
          <div className="bg-gray-800 px-3 py-2 flex items-center gap-2">
            <span className="text-xs text-gray-300 truncate flex-1">{currentMedia.title}</span>
            <button 
              onClick={() => setIsMuted(!isMuted)}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            >
              {isMuted ? 
                <VolumeX className="w-4 h-4 text-gray-400" /> : 
                <Volume2 className="w-4 h-4 text-gray-400" />
              }
            </button>
            <button 
              onClick={() => setCurrentMedia(null)}
              className="p-1.5 hover:bg-gray-700 rounded transition-colors"
            >
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>
        )}

        {/* Media Library */}
        <div className="p-3 max-h-48 overflow-y-auto bg-neutral-800">
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-medium text-neutral-400">Library</span>
            <button 
              onClick={() => setShowAddForm(!showAddForm)}
              className="p-1.5 hover:bg-neutral-700 rounded-lg transition-colors"
            >
              <Plus className="w-4 h-4 text-cyan-400" />
            </button>
          </div>

          {showAddForm && (
            <div className="mb-3 p-3 bg-neutral-900 rounded-lg space-y-2 border border-neutral-700">
              <Input
                placeholder="Title"
                value={newMedia.title}
                onChange={e => setNewMedia({ ...newMedia, title: e.target.value })}
                className="h-8 text-xs bg-neutral-800 border-neutral-600 text-white"
              />
              <Input
                placeholder="YouTube, Vimeo, or direct URL"
                value={newMedia.url}
                onChange={e => setNewMedia({ ...newMedia, url: e.target.value })}
                className="h-8 text-xs bg-neutral-800 border-neutral-600 text-white"
              />
              <div className="flex gap-2">
                <button
                  onClick={() => setNewMedia({ ...newMedia, type: 'video' })}
                  className={`flex-1 py-1.5 text-xs rounded-lg flex items-center justify-center gap-1 transition-colors ${
                    newMedia.type === 'video' ? 'bg-cyan-500 text-white' : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  <Film className="w-3 h-3" /> Video
                </button>
                <button
                  onClick={() => setNewMedia({ ...newMedia, type: 'game' })}
                  className={`flex-1 py-1.5 text-xs rounded-lg flex items-center justify-center gap-1 transition-colors ${
                    newMedia.type === 'game' ? 'bg-violet-500 text-white' : 'bg-neutral-700 text-neutral-400'
                  }`}
                >
                  <Gamepad2 className="w-3 h-3" /> Game
                </button>
              </div>
              <Button size="sm" onClick={handleAddMedia} className="w-full h-8 text-xs bg-cyan-500 hover:bg-cyan-400">
                Add URL
              </Button>
              <div className="relative">
                <input
                  type="file"
                  accept="video/*"
                  onChange={handleFileUpload}
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  disabled={uploading}
                />
                <Button size="sm" variant="outline" className="w-full h-8 text-xs border-neutral-600 text-neutral-300" disabled={uploading}>
                  <Upload className="w-3 h-3 mr-1" />
                  {uploading ? 'Uploading...' : 'Upload Video'}
                </Button>
              </div>
            </div>
          )}

          <div className="space-y-1">
            {mediaItems.map(item => (
              <div 
                key={item.id}
                className={`group flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all ${
                  currentMedia?.id === item.id ? 'bg-cyan-500/20 border border-cyan-500/30' : 'hover:bg-neutral-700 border border-transparent'
                }`}
                onClick={() => setCurrentMedia(item)}
              >
                {item.type === 'game' ? 
                  <Gamepad2 className="w-4 h-4 text-violet-400" /> : 
                  <Film className="w-4 h-4 text-cyan-400" />
                }
                <span className="text-xs text-neutral-300 flex-1 truncate">{item.title}</span>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleDeleteMedia(item.id); }}
                  className="p-1 hover:bg-red-500/20 rounded opacity-0 group-hover:opacity-100 transition-all"
                >
                  <Trash2 className="w-3 h-3 text-red-400" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}