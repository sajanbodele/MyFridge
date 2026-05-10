import React, { useState } from 'react';
import { ZoomIn, ZoomOut, Move, Maximize } from 'lucide-react';

const fridgeStyles = {
  glossy_white: {
    bg: 'bg-gradient-to-br from-gray-50 via-white to-gray-100',
    texture: 'bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.9)_0%,_transparent_60%)]',
    border: 'border-gray-200',
    handle: 'from-gray-300 via-gray-200 to-gray-400',
    accent: 'from-gray-100 to-gray-200'
  },
  stainless_steel: {
    bg: 'bg-gradient-to-b from-slate-300 via-slate-200 to-slate-300',
    texture: 'bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,rgba(255,255,255,0.05)_2px,rgba(255,255,255,0.05)_4px)]',
    border: 'border-slate-400',
    handle: 'from-slate-500 via-slate-300 to-slate-500',
    accent: 'from-slate-300 to-slate-400'
  },
  retro_mint: {
    bg: 'bg-gradient-to-br from-emerald-200 via-teal-100 to-emerald-200',
    texture: 'bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.7)_0%,_transparent_50%)]',
    border: 'border-emerald-300',
    handle: 'from-emerald-400 via-emerald-300 to-emerald-500',
    accent: 'from-emerald-300 to-emerald-400'
  },
  pastel_pink: {
    bg: 'bg-gradient-to-br from-pink-200 via-rose-100 to-pink-200',
    texture: 'bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.7)_0%,_transparent_50%)]',
    border: 'border-pink-300',
    handle: 'from-pink-400 via-pink-300 to-pink-500',
    accent: 'from-pink-300 to-pink-400'
  },
  matte_gray: {
    bg: 'bg-gradient-to-b from-gray-500 via-gray-400 to-gray-500',
    texture: '',
    border: 'border-gray-600',
    handle: 'from-gray-600 via-gray-500 to-gray-700',
    accent: 'from-gray-500 to-gray-600'
  },
  retro_cream: {
    bg: 'bg-gradient-to-br from-amber-50 via-orange-50 to-yellow-50',
    texture: 'bg-[radial-gradient(ellipse_at_top_left,_rgba(255,255,255,0.8)_0%,_transparent_50%)]',
    border: 'border-amber-200',
    handle: 'from-amber-400 via-amber-300 to-amber-500',
    accent: 'from-amber-200 to-amber-300'
  }
};

const galleryBackgrounds = {
  kitchen1: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920',
  kitchen2: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920',
  marble: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920',
  wood: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920',
  tiles: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1920',
  gradient1: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920',
  plants: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1920',
  abstract: 'https://images.unsplash.com/photo-1557683316-973673bdar25?w=1920'
};

export default function FridgeSurface({ style = 'stainless_steel', children, showKitchenBg, backgroundSettings = {} }) {
  const fridgeStyle = fridgeStyles[style] || fridgeStyles.stainless_steel;
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [lastPanPoint, setLastPanPoint] = useState({ x: 0, y: 0 });

  const handleZoomIn = () => setZoom(prev => Math.min(prev + 0.25, 2));
  const handleZoomOut = () => setZoom(prev => Math.max(prev - 0.25, 0.5));
  const handleReset = () => { setZoom(1); setPan({ x: 0, y: 0 }); };

  const handleMouseDown = (e) => {
    if (e.target.closest('.fridge-content') || zoom === 1) return;
    setIsPanning(true);
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseMove = (e) => {
    if (!isPanning) return;
    const dx = e.clientX - lastPanPoint.x;
    const dy = e.clientY - lastPanPoint.y;
    setPan(prev => ({ x: prev.x + dx, y: prev.y + dy }));
    setLastPanPoint({ x: e.clientX, y: e.clientY });
  };

  const handleMouseUp = () => setIsPanning(false);
  
  const getBackgroundStyle = () => {
    const { background_type, background_color, background_image, gallery_background } = backgroundSettings;
    
    switch (background_type) {
      case 'color':
        return { backgroundColor: background_color || '#FEF3C7' };
      case 'image':
        return background_image ? { 
          backgroundImage: `url(${background_image})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {};
      case 'gallery':
        const galleryUrl = galleryBackgrounds[gallery_background];
        return galleryUrl ? {
          backgroundImage: `url(${galleryUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center'
        } : {};
      default:
        return {};
    }
  };

  const bgStyle = getBackgroundStyle();
  const hasCustomBg = backgroundSettings.background_type && backgroundSettings.background_type !== 'default';

  return (
    <div 
      className={`min-h-screen w-full flex items-center justify-center p-4 md:p-8 transition-all duration-700 overflow-hidden ${
        !hasCustomBg ? 'bg-gradient-to-br from-stone-200 via-stone-100 to-amber-50' : ''
      }`}
      style={hasCustomBg ? bgStyle : {}}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Zoom controls */}
      <div className="fixed bottom-4 left-4 z-50 flex gap-1 bg-white/90 backdrop-blur-sm rounded-xl shadow-lg p-1">
        <button
          onClick={handleZoomOut}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom out"
        >
          <ZoomOut className="w-4 h-4 text-gray-600" />
        </button>
        <span className="px-2 py-2 text-xs text-gray-600 font-medium min-w-[40px] text-center">
          {Math.round(zoom * 100)}%
        </span>
        <button
          onClick={handleZoomIn}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Zoom in"
        >
          <ZoomIn className="w-4 h-4 text-gray-600" />
        </button>
        <div className="w-px bg-gray-200 mx-1" />
        <button
          onClick={handleReset}
          className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          title="Reset view"
        >
          <Maximize className="w-4 h-4 text-gray-600" />
        </button>
      </div>

      {zoom !== 1 && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-black/70 text-white text-xs px-3 py-1.5 rounded-full flex items-center gap-2">
          <Move className="w-3 h-3" />
          Drag to pan
        </div>
      )}

      {/* Ambient warm light overlay */}
      <div className="fixed inset-0 pointer-events-none bg-gradient-to-b from-amber-100/30 via-transparent to-stone-200/20" />
      
      {/* Fridge Door */}
      <div 
        className={`relative w-full max-w-7xl aspect-[3/4] md:aspect-[16/10] rounded-3xl shadow-[0_25px_60px_-15px_rgba(0,0,0,0.3)] overflow-hidden ${fridgeStyle.bg} ${fridgeStyle.border} border-4 transition-transform duration-200`}
        style={{
          transform: `scale(${zoom}) translate(${pan.x / zoom}px, ${pan.y / zoom}px)`,
          cursor: zoom !== 1 ? (isPanning ? 'grabbing' : 'grab') : 'default'
        }}
      >
        {/* Metallic texture overlay */}
        <div className={`absolute inset-0 ${fridgeStyle.texture} pointer-events-none`} />
        
        {/* Subtle reflection - enhanced */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/40 via-transparent to-black/10 pointer-events-none" />
        
        {/* Light source reflections - multiple for realism */}
        <div className="absolute -top-32 -left-32 w-80 h-80 bg-white/25 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute -top-20 right-20 w-40 h-40 bg-white/15 rounded-full blur-2xl pointer-events-none" />
        
        {/* Handle - enhanced 3D effect */}
        <div className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-10">
          {/* Handle shadow */}
          <div className="absolute inset-0 translate-x-1 translate-y-2 w-4 h-36 md:h-52 rounded-full bg-black/20 blur-md" />
          {/* Handle body */}
          <div className={`relative w-4 h-36 md:h-52 rounded-full bg-gradient-to-r ${fridgeStyle.handle} shadow-xl`}>
            {/* Handle highlight */}
            <div className="absolute inset-y-0 left-0 w-1/2 bg-gradient-to-r from-white/40 to-transparent rounded-l-full" />
            {/* Handle grip lines */}
            <div className="absolute inset-x-1 top-8 bottom-8 flex flex-col justify-around">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="h-px bg-black/10" />
              ))}
            </div>
          </div>
        </div>
        
        {/* Edge bevel effect */}
        <div className="absolute inset-0 rounded-3xl shadow-[inset_0_2px_4px_rgba(255,255,255,0.3),inset_0_-2px_4px_rgba(0,0,0,0.1)] pointer-events-none" />
        
        {/* Content area */}
        <div className="fridge-content absolute inset-0 p-4 md:p-8 overflow-hidden">
          {children}
        </div>
        
        {/* Manufacturer badge */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-gray-200/50 to-gray-300/50 backdrop-blur-sm">
          <span className="text-[10px] font-semibold text-gray-500 tracking-widest uppercase">FridgeTab</span>
        </div>
      </div>
    </div>
  );
}