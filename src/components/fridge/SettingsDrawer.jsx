const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState } from 'react';
import { X, Volume2, VolumeX, Sparkles, Home, Palette, Image, Upload, Check, Tv } from 'lucide-react';
import { Switch } from "@/components/ui/switch";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

const fridgeStyles = [
  { id: 'glossy_white', name: 'Glossy White', color: 'bg-white border-gray-200' },
  { id: 'stainless_steel', name: 'Stainless Steel', color: 'bg-gradient-to-b from-slate-300 to-slate-400' },
  { id: 'retro_mint', name: 'Retro Mint', color: 'bg-gradient-to-b from-emerald-200 to-teal-300' },
  { id: 'pastel_pink', name: 'Pastel Pink', color: 'bg-gradient-to-b from-pink-200 to-rose-300' },
  { id: 'matte_gray', name: 'Matte Gray', color: 'bg-gradient-to-b from-gray-400 to-gray-500' },
  { id: 'retro_cream', name: 'Retro Cream', color: 'bg-gradient-to-b from-amber-100 to-orange-200' }
];

const galleryBackgrounds = [
  { id: 'kitchen1', name: 'Cozy Kitchen', url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=1920' },
  { id: 'kitchen2', name: 'Modern Kitchen', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=1920' },
  { id: 'marble', name: 'Marble', url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=1920' },
  { id: 'wood', name: 'Wooden Wall', url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=1920' },
  { id: 'tiles', name: 'Blue Tiles', url: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?w=1920' },
  { id: 'gradient1', name: 'Sunset', url: 'https://images.unsplash.com/photo-1507400492013-162706c8c05e?w=1920' },
  { id: 'plants', name: 'Plants', url: 'https://images.unsplash.com/photo-1463320726281-696a485928c7?w=1920' },
  { id: 'abstract', name: 'Abstract', url: 'https://images.unsplash.com/photo-1557683316-973673bdar25?w=1920' }
];

const presetColors = [
  '#FEF3C7', '#FECACA', '#BBF7D0', '#BFDBFE', '#DDD6FE', '#FBCFE8',
  '#F5F5F4', '#FED7AA', '#A5F3FC', '#E9D5FF', '#FDE68A', '#D1D5DB'
];

export default function SettingsDrawer({ 
  isOpen, 
  onClose, 
  settings, 
  onSettingsChange 
}) {
  const [uploading, setUploading] = useState(false);
  const [customImageUrl, setCustomImageUrl] = useState(settings?.background_image || '');

  const handleImageUpload = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploading(true);
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    onSettingsChange({ 
      ...settings, 
      background_type: 'image', 
      background_image: file_url 
    });
    setCustomImageUrl(file_url);
    setUploading(false);
  };

  const handleCustomUrlSubmit = () => {
    if (customImageUrl.trim()) {
      onSettingsChange({ 
        ...settings, 
        background_type: 'image', 
        background_image: customImageUrl.trim() 
      });
    }
  };

  if (!isOpen) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/30 backdrop-blur-sm z-40"
        onClick={onClose}
      />
      
      {/* Drawer - styled like a freezer drawer */}
      <div className={`
        fixed bottom-0 left-0 right-0 z-50
        bg-gradient-to-b from-slate-100 to-white
        rounded-t-3xl shadow-2xl
        transform transition-transform duration-300
        ${isOpen ? 'translate-y-0' : 'translate-y-full'}
        max-h-[80vh] overflow-y-auto
      `}>
        {/* Handle */}
        <div className="flex justify-center pt-3 pb-2">
          <div className="w-12 h-1.5 bg-gray-300 rounded-full" />
        </div>
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 pb-4 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-800">Fridge Settings</h2>
          <button 
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>
        
        {/* Content */}
        <div className="p-6 space-y-8">
          {/* Fridge Style */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Fridge Style
            </h3>
            <div className="grid grid-cols-5 gap-3">
              {fridgeStyles.map(style => (
                <button
                  key={style.id}
                  onClick={() => onSettingsChange({ ...settings, fridge_style: style.id })}
                  className={`
                    aspect-square rounded-xl ${style.color} border-2
                    transition-all duration-200
                    ${settings.fridge_style === style.id 
                      ? 'ring-2 ring-blue-500 ring-offset-2 scale-105' 
                      : 'hover:scale-105'}
                  `}
                  title={style.name}
                >
                  <span className="sr-only">{style.name}</span>
                </button>
              ))}
            </div>
            <p className="text-xs text-gray-500 mt-2 text-center">
              {fridgeStyles.find(s => s.id === settings.fridge_style)?.name}
            </p>
          </div>
          
          {/* Background Settings */}
          <div>
            <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
              <Image className="w-4 h-4" />
              Background
            </h3>
            
            {/* Background Type Tabs */}
            <div className="flex gap-2 mb-4">
              {[
                { id: 'default', label: 'Default' },
                { id: 'color', label: 'Color' },
                { id: 'gallery', label: 'Gallery' },
                { id: 'image', label: 'Custom' }
              ].map(tab => (
                <button
                  key={tab.id}
                  onClick={() => onSettingsChange({ ...settings, background_type: tab.id })}
                  className={`px-3 py-1.5 rounded-lg text-sm font-medium transition-all ${
                    (settings.background_type || 'default') === tab.id
                      ? 'bg-slate-800 text-white'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  }`}
                >
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Color Picker */}
            {settings.background_type === 'color' && (
              <div className="space-y-3">
                <div className="grid grid-cols-6 gap-2">
                  {presetColors.map(color => (
                    <button
                      key={color}
                      onClick={() => onSettingsChange({ ...settings, background_color: color })}
                      className={`w-10 h-10 rounded-lg shadow-sm transition-all ${
                        settings.background_color === color ? 'ring-2 ring-blue-500 ring-offset-2 scale-110' : 'hover:scale-105'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
                <div className="flex gap-2 items-center">
                  <input
                    type="color"
                    value={settings.background_color || '#FEF3C7'}
                    onChange={(e) => onSettingsChange({ ...settings, background_color: e.target.value })}
                    className="w-10 h-10 rounded-lg cursor-pointer border-0"
                  />
                  <span className="text-sm text-gray-500">Custom color picker</span>
                </div>
              </div>
            )}

            {/* Gallery */}
            {settings.background_type === 'gallery' && (
              <div className="grid grid-cols-4 gap-2">
                {galleryBackgrounds.map(bg => (
                  <button
                    key={bg.id}
                    onClick={() => onSettingsChange({ ...settings, gallery_background: bg.id })}
                    className={`relative aspect-video rounded-lg overflow-hidden transition-all ${
                      settings.gallery_background === bg.id ? 'ring-2 ring-blue-500 ring-offset-2' : 'hover:opacity-80'
                    }`}
                  >
                    <img src={bg.url} alt={bg.name} className="w-full h-full object-cover" />
                    {settings.gallery_background === bg.id && (
                      <div className="absolute inset-0 bg-blue-500/30 flex items-center justify-center">
                        <Check className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            )}

            {/* Custom Image */}
            {settings.background_type === 'image' && (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <Input
                    placeholder="Paste image URL..."
                    value={customImageUrl}
                    onChange={(e) => setCustomImageUrl(e.target.value)}
                    className="flex-1"
                  />
                  <Button onClick={handleCustomUrlSubmit} size="sm">
                    Apply
                  </Button>
                </div>
                <div className="relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    disabled={uploading}
                  />
                  <div className={`border-2 border-dashed border-gray-300 rounded-xl p-4 text-center hover:border-blue-400 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                    <Upload className="w-6 h-6 mx-auto text-gray-400 mb-2" />
                    <p className="text-sm text-gray-600">
                      {uploading ? 'Uploading...' : 'Click or drag to upload image'}
                    </p>
                  </div>
                </div>
                {settings.background_image && (
                  <div className="rounded-lg overflow-hidden border border-gray-200">
                    <img src={settings.background_image} alt="Preview" className="w-full h-24 object-cover" />
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                {settings.enable_sounds ? (
                  <Volume2 className="w-5 h-5 text-gray-600" />
                ) : (
                  <VolumeX className="w-5 h-5 text-gray-600" />
                )}
                <div>
                  <p className="font-medium text-gray-800">Sound Effects</p>
                  <p className="text-xs text-gray-500">Magnet clicks & paper rustles</p>
                </div>
              </div>
              <Switch
                checked={settings.enable_sounds}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, enable_sounds: checked })}
              />
            </div>
            
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
              <div className="flex items-center gap-3">
                <Sparkles className="w-5 h-5 text-gray-600" />
                <div>
                  <p className="font-medium text-gray-800">Magnet Physics</p>
                  <p className="text-xs text-gray-500">Wobble & bounce effects</p>
                </div>
              </div>
              <Switch
                checked={settings.magnet_physics}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, magnet_physics: checked })}
              />
            </div>

            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-cyan-50 to-blue-50 rounded-xl border border-cyan-100">
              <div className="flex items-center gap-3">
                <Tv className="w-5 h-5 text-cyan-600" />
                <div>
                  <p className="font-medium text-gray-800">Smart TV</p>
                  <p className="text-xs text-gray-500">Watch videos & play games</p>
                </div>
              </div>
              <Switch
                checked={settings.show_smart_tv}
                onCheckedChange={(checked) => onSettingsChange({ ...settings, show_smart_tv: checked })}
              />
            </div>
            </div>
        </div>
        
        {/* Footer */}
        <div className="p-6 pt-0">
          <p className="text-center text-xs text-gray-400">
            🧊 FridgeTab • Your cozy new tab page
          </p>
        </div>
      </div>
    </>
  );
}