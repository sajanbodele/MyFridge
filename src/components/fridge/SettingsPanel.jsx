const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useRef } from 'react';
import { X, Check, Upload, RotateCcw } from 'lucide-react';

const FRIDGE_STYLES = [
  { id: 'glossy_white',    label: 'Glossy White',    bg: 'bg-gradient-to-br from-gray-50 to-white',          border: 'border-gray-200' },
  { id: 'stainless_steel', label: 'Stainless Steel', bg: 'bg-gradient-to-b from-slate-300 to-slate-200',      border: 'border-slate-400' },
  { id: 'retro_mint',      label: 'Retro Mint',      bg: 'bg-gradient-to-br from-emerald-200 to-teal-100',    border: 'border-emerald-300' },
  { id: 'pastel_pink',     label: 'Pastel Pink',     bg: 'bg-gradient-to-br from-pink-200 to-rose-100',       border: 'border-pink-300' },
  { id: 'matte_gray',      label: 'Matte Gray',      bg: 'bg-gradient-to-b from-gray-400 to-gray-500',        border: 'border-gray-500' },
  { id: 'retro_cream',     label: 'Retro Cream',     bg: 'bg-gradient-to-br from-amber-50 to-yellow-100',     border: 'border-amber-200' },
];

const GALLERY_BACKGROUNDS = [
  { id: 'cozy_kitchen',   label: 'Cozy Kitchen',  url: 'https://images.unsplash.com/photo-1556909114-f6e7ad7d3136?w=400' },
  { id: 'modern_kitchen', label: 'Modern Kitchen', url: 'https://images.unsplash.com/photo-1556909172-54557c7e4fb7?w=400' },
  { id: 'marble',         label: 'Marble',         url: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400' },
  { id: 'wooden_wall',    label: 'Wooden Wall',    url: 'https://images.unsplash.com/photo-1542621334-a254cf47733d?w=400' },
  { id: 'blue_tiles',     label: 'Blue Tiles',     url: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=400' },
  { id: 'sunset',         label: 'Sunset',         url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400' },
  { id: 'plants',         label: 'Plants',         url: 'https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400' },
  { id: 'abstract',       label: 'Abstract',       url: 'https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400' },
];

const DEFAULT_ITEM_SIZES = ['small', 'medium', 'large'];
const DEFAULT_ITEM_TYPES = [
  { id: 'sticky_note', label: 'Note' },
  { id: 'link', label: 'Link' },
  { id: 'photo', label: 'Photo' },
];

function SectionLabel({ children }) {
  return <p className="text-[11px] font-semibold text-gray-400 uppercase tracking-wider mb-3">{children}</p>;
}

function ToggleRow({ label, desc, value, onChange }) {
  return (
    <div className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0">
      <div>
        <p className="text-xs font-medium text-gray-700">{label}</p>
        {desc && <p className="text-[11px] text-gray-400 mt-0.5">{desc}</p>}
      </div>
      <button
        onClick={() => onChange(!value)}
        className={`w-9 h-5 rounded-full transition-all relative flex-shrink-0 ml-4 ${value ? 'bg-primary' : 'bg-gray-200'}`}
      >
        <div className={`w-3.5 h-3.5 rounded-full bg-white shadow absolute top-0.5 transition-all ${value ? 'left-[18px]' : 'left-0.5'}`} />
      </button>
    </div>
  );
}

export default function SettingsPanel({ isOpen, onClose, settings, onChange }) {
  const bgImageRef = useRef(null);

  if (!isOpen) return null;

  const set = (key, val) => onChange({ ...settings, [key]: val });

  const handleBgImageUpload = async (file) => {
    if (!file) return;
    const { file_url } = await db.integrations.Core.UploadFile({ file });
    onChange({ ...settings, background_type: 'image', background_image: file_url });
  };

  const handleResetLayout = () => {
    if (confirm('Reset item layout? Items will be rearranged.')) {
      onChange({ ...settings, _reset_layout: Date.now() });
    }
  };

  const handleResetTheme = () => {
    onChange({
      ...settings,
      fridge_style: 'glossy_white',
      background_type: 'default',
      background_color: null,
      background_image: null,
      gallery_background: null,
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-[2px]" onClick={onClose} />
      <div className="relative w-full max-w-sm animate-scale-in">
        <div className="bg-white rounded-3xl shadow-2xl border border-gray-100 overflow-hidden max-h-[85vh] flex flex-col">
          {/* Header */}
          <div className="flex items-center justify-between px-5 pt-5 pb-4 border-b border-gray-100 flex-shrink-0">
            <h3 className="text-sm font-semibold text-gray-800">⚙️ Settings</h3>
            <button onClick={onClose} className="w-7 h-7 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors">
              <X className="w-4 h-4 text-gray-400" />
            </button>
          </div>

          <div className="overflow-y-auto p-5 space-y-7">

            {/* ── Fridge Style ── */}
            <div>
              <SectionLabel>Fridge Style</SectionLabel>
              <div className="grid grid-cols-3 gap-2">
                {FRIDGE_STYLES.map(style => (
                  <button
                    key={style.id}
                    onClick={() => set('fridge_style', style.id)}
                    className={`relative p-0.5 rounded-xl border-2 transition-all ${settings.fridge_style === style.id ? 'border-primary scale-[1.03]' : 'border-transparent hover:border-gray-200'}`}
                  >
                    <div className={`h-10 rounded-lg ${style.bg} ${style.border} border`} />
                    <p className="text-[10px] text-center mt-1 text-gray-500 font-medium leading-tight">{style.label}</p>
                    {settings.fridge_style === style.id && (
                      <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                        <Check className="w-2.5 h-2.5 text-white" />
                      </div>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* ── Background ── */}
            <div>
              <SectionLabel>Background</SectionLabel>
              {/* Type selector */}
              <div className="flex gap-2 mb-3">
                {[
                  { id: 'default', label: 'Default' },
                  { id: 'color', label: 'Color' },
                  { id: 'gallery', label: 'Gallery' },
                  { id: 'image', label: 'Upload' },
                ].map(opt => (
                  <button
                    key={opt.id}
                    onClick={() => set('background_type', opt.id)}
                    className={`flex-1 h-8 rounded-xl text-xs font-medium border transition-all ${
                      settings.background_type === opt.id
                        ? 'bg-primary text-white border-primary'
                        : 'text-gray-500 border-gray-200 hover:border-primary/40 bg-gray-50'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>

              {settings.background_type === 'color' && (
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={settings.background_color || '#FFF8F0'}
                    onChange={e => set('background_color', e.target.value)}
                    className="w-10 h-10 rounded-xl border border-gray-200 cursor-pointer"
                  />
                  <p className="text-xs text-gray-500">Pick a background color</p>
                </div>
              )}

              {settings.background_type === 'gallery' && (
                <div className="grid grid-cols-4 gap-2">
                  {GALLERY_BACKGROUNDS.map(bg => (
                    <button
                      key={bg.id}
                      onClick={() => set('gallery_background', bg.id)}
                      className={`relative rounded-xl overflow-hidden border-2 transition-all ${settings.gallery_background === bg.id ? 'border-primary' : 'border-transparent hover:border-gray-300'}`}
                    >
                      <img src={bg.url} alt={bg.label} className="w-full h-12 object-cover" />
                      <p className="text-[9px] text-center py-0.5 text-gray-500 leading-tight">{bg.label}</p>
                      {settings.gallery_background === bg.id && (
                        <div className="absolute top-1 right-1 w-4 h-4 rounded-full bg-primary flex items-center justify-center">
                          <Check className="w-2.5 h-2.5 text-white" />
                        </div>
                      )}
                    </button>
                  ))}
                </div>
              )}

              {settings.background_type === 'image' && (
                <div>
                  {settings.background_image ? (
                    <div className="relative rounded-xl overflow-hidden">
                      <img src={settings.background_image} alt="Background" className="w-full h-24 object-cover" />
                      <button
                        onClick={() => onChange({ ...settings, background_image: null })}
                        className="absolute top-2 right-2 w-6 h-6 bg-black/50 rounded-full flex items-center justify-center"
                      >
                        <X className="w-3 h-3 text-white" />
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={() => bgImageRef.current?.click()}
                      className="w-full h-20 border-2 border-dashed border-gray-200 rounded-xl flex flex-col items-center justify-center gap-1.5 hover:border-primary/40 hover:bg-gray-50 transition-all"
                    >
                      <Upload className="w-4 h-4 text-gray-400" />
                      <p className="text-xs text-gray-400">Upload background image</p>
                    </button>
                  )}
                  <input ref={bgImageRef} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleBgImageUpload(e.target.files[0]); }} />
                </div>
              )}
            </div>

            {/* ── Sound Effects ── */}
            <div>
              <SectionLabel>Sound Effects</SectionLabel>
              <ToggleRow
                label="Enable sounds"
                desc="Magnet click, paper rustle"
                value={settings.enable_sounds !== false}
                onChange={v => set('enable_sounds', v)}
              />
            </div>

            {/* ── Magnet Physics ── */}
            <div>
              <SectionLabel>Magnet Physics</SectionLabel>
              <ToggleRow
                label="Enable physics"
                desc="Snap to position, wobble on drop, bounce effect"
                value={settings.magnet_physics !== false}
                onChange={v => set('magnet_physics', v)}
              />
            </div>

            {/* ── Visual Preferences ── */}
            <div>
              <SectionLabel>Visual Preferences</SectionLabel>
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Default item size</p>
                <div className="flex gap-2">
                  {DEFAULT_ITEM_SIZES.map(size => (
                    <button
                      key={size}
                      onClick={() => set('default_size', size)}
                      className={`flex-1 h-8 rounded-xl text-xs font-semibold border capitalize transition-all ${
                        (settings.default_size || 'medium') === size
                          ? 'bg-primary text-white border-primary'
                          : 'text-gray-500 border-gray-200 hover:border-primary/40 bg-gray-50'
                      }`}
                    >
                      {size.charAt(0).toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>
              <ToggleRow
                label="Show stickers"
                value={settings.show_stickers !== false}
                onChange={v => set('show_stickers', v)}
              />
              <ToggleRow
                label="Show shadows"
                desc="Drop shadows on items"
                value={settings.show_shadows !== false}
                onChange={v => set('show_shadows', v)}
              />
              <ToggleRow
                label="Random rotation"
                desc="Items appear with a slight tilt"
                value={settings.random_rotation !== false}
                onChange={v => set('random_rotation', v)}
              />
            </div>

            {/* ── Behavior Settings ── */}
            <div>
              <SectionLabel>Behavior</SectionLabel>
              <div className="mb-3">
                <p className="text-xs font-medium text-gray-700 mb-2">Default item type</p>
                <div className="flex gap-2">
                  {DEFAULT_ITEM_TYPES.map(t => (
                    <button
                      key={t.id}
                      onClick={() => set('default_item_type', t.id)}
                      className={`flex-1 h-8 rounded-xl text-xs font-medium border transition-all ${
                        (settings.default_item_type || 'sticky_note') === t.id
                          ? 'bg-primary text-white border-primary'
                          : 'text-gray-500 border-gray-200 hover:border-primary/40 bg-gray-50'
                      }`}
                    >
                      {t.label}
                    </button>
                  ))}
                </div>
              </div>
              <ToggleRow
                label="Auto-focus new item"
                desc="Jump to edit when item is added"
                value={settings.auto_focus_new !== false}
                onChange={v => set('auto_focus_new', v)}
              />
              <ToggleRow
                label="Show right panel"
                desc="Weather and today's tasks"
                value={settings.show_right_panel !== false}
                onChange={v => set('show_right_panel', v)}
              />
              <div className="flex items-center justify-between py-3 border-b border-gray-100">
                <div>
                  <p className="text-xs font-medium text-gray-700">Auto-save</p>
                  <p className="text-[11px] text-gray-400 mt-0.5">Always on — changes save instantly</p>
                </div>
                <span className="text-[10px] text-green-600 font-semibold bg-green-50 px-2 py-0.5 rounded-full">ON</span>
              </div>
            </div>

            {/* ── Reset Options ── */}
            <div>
              <SectionLabel>Reset</SectionLabel>
              <div className="space-y-2">
                <button
                  onClick={handleResetLayout}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset layout
                </button>
                <button
                  onClick={handleResetTheme}
                  className="w-full flex items-center gap-3 px-4 py-3 rounded-xl border border-gray-200 hover:border-red-200 hover:bg-red-50 text-gray-600 hover:text-red-600 text-xs font-medium transition-all"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset theme & background
                </button>
              </div>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}