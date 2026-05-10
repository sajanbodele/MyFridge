const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect, useCallback, useRef } from 'react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import TopBar from '@/components/fridge/TopBar';
import NewFridgeSurface from '@/components/fridge/NewFridgeSurface';
import FridgeItemWrapper from '@/components/fridge/FridgeItem';
import RightPanel from '@/components/fridge/RightPanel';
import AddItemPopup from '@/components/fridge/AddItemPopup';
import EditItemDrawer from '@/components/fridge/EditItemDrawer';
import FridgeAssistant from '@/components/fridge/FridgeAssistant';
import SettingsPanel from '@/components/fridge/SettingsPanel';
import FocusModeBar from '@/components/fridge/FocusModeBar';

const DEFAULT_SETTINGS = {
  fridge_style: 'glossy_white',
  enable_sounds: true,
  magnet_physics: true,
  show_right_panel: true,
  random_rotation: true,
  default_size: 'medium',
  show_stickers: true,
  show_shadows: true,
  default_item_type: 'sticky_note',
  auto_focus_new: true,
  background_type: 'default',
};

const SAMPLE_ITEMS = [
  // Grocery checklist
  {
    id: 's1', type: 'sticky_note',
    title: '🛒 Groceries',
    content: '- Milk\n- Eggs\n- Bread\n- Butter\n- Bananas\n- Coffee',
    note_color: 'green',
    position_x: 13, position_y: 3, rotation: -3, is_pinned: false,
  },
  // Meeting reminder
  {
    id: 's2', type: 'sticky_note',
    title: '📅 Reminder',
    content: 'Meeting at 3 PM\nZoom call — don\'t forget!\n\nLink in email 📧',
    note_color: 'yellow',
    position_x: 52, position_y: 4, rotation: 2, is_pinned: true,
  },
  // Call Mom
  {
    id: 's3', type: 'sticky_note',
    content: 'Call Mom ❤️\nSunday evening',
    note_color: 'pink',
    position_x: 5, position_y: 30, rotation: 4, is_pinned: false,
  },
  // Quote note
  {
    id: 's4', type: 'sticky_note',
    title: '✨ Quote',
    content: '"Everything you want is on the other side of fear."\n\n— Jack Canfield',
    note_color: 'purple',
    position_x: 34, position_y: 20, rotation: -1, is_pinned: false,
  },
  // Electricity bill
  {
    id: 's5', type: 'sticky_note',
    title: '💡 Electricity Bill',
    content: 'Due: May 5\nAmount: ₹1,240\n\n⚠️ Pay before cutoff!',
    note_color: 'orange',
    position_x: 64, position_y: 18, rotation: 3, is_pinned: false,
  },
  // Plumber contact
  {
    id: 's6', type: 'sticky_note',
    title: '🔧 Plumber Ravi',
    content: 'Phone: 98765 43210\n\nAvailable Mon–Sat\n9am to 7pm',
    note_color: 'blue',
    position_x: 5, position_y: 54, rotation: -2, is_pinned: false,
  },
  // Order dinner link
  {
    id: 's7', type: 'link',
    title: 'Order Dinner 🍛',
    content: 'https://swiggy.com',
    magnet_color: 'orange',
    position_x: 30, position_y: 60, rotation: -3, is_pinned: false,
  },
  // Goa trip photo
  {
    id: 's8', type: 'photo',
    title: 'Goa Trip 🌴',
    content: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400',
    magnet_color: 'blue',
    position_x: 18, position_y: 36, rotation: 5, is_pinned: false,
  },
  // Family photo
  {
    id: 's9', type: 'photo',
    title: 'Family ❤️',
    content: 'https://images.unsplash.com/photo-1511895426328-dc8714191011?w=400',
    magnet_color: 'red',
    position_x: 55, position_y: 40, rotation: -4, is_pinned: false,
  },
  // Doodle
  {
    id: 's10', type: 'drawing',
    content: '',
    magnet_color: 'purple',
    position_x: 72, position_y: 55, rotation: 2, is_pinned: false,
  },
  // Decorative stickers
  {
    id: 's11', type: 'sticker',
    content: '⭐',
    position_x: 48, position_y: 12, rotation: 8, is_pinned: false,
  },
  {
    id: 's12', type: 'sticker',
    content: '❤️',
    position_x: 7, position_y: 76, rotation: -5, is_pinned: false,
  },
  {
    id: 's13', type: 'sticker',
    content: '📍',
    position_x: 44, position_y: 58, rotation: 0, is_pinned: false,
  },
  {
    id: 's14', type: 'sticker',
    content: '🌴',
    position_x: 62, position_y: 75, rotation: 6, is_pinned: false,
  },
  {
    id: 's15', type: 'sticker',
    content: '✈️',
    position_x: 78, position_y: 7, rotation: -10, is_pinned: false,
  },
  {
    id: 's16', type: 'sticker',
    content: '🎉',
    position_x: 25, position_y: 78, rotation: 3, is_pinned: false,
  },
];

const DEFAULT_TASKS = [
  { id: 't1', text: 'Morning workout', done: true },
  { id: 't2', text: 'Review weekly goals', done: false },
  { id: 't3', text: 'Call mom', done: false },
  { id: 't4', text: 'Buy groceries', done: false },
];

export default function FridgeHome() {
  const queryClient = useQueryClient();
  const [focusMode, setFocusMode] = useState(false);
  const [focusFilter, setFocusFilter] = useState('pinned'); // 'pinned' | 'recent' | 'today' | null
  const [showAdd, setShowAdd] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [newItemIds, setNewItemIds] = useState(new Set());
  const [spawnPos, setSpawnPos] = useState(null);
  const canvasRef = useRef(null);
  const [tasks, setTasks] = useState(DEFAULT_TASKS);
  const [settings, setSettings] = useState(DEFAULT_SETTINGS);
  const [localItems, setLocalItems] = useState(SAMPLE_ITEMS);

  // Fetch items from DB
  const { data: dbItems = [] } = useQuery({
    queryKey: ['fridgeItems-home'],
    queryFn: () => db.entities.FridgeItem.list(),
    initialData: [],
  });

  // Fetch settings
  const { data: dbSettings } = useQuery({
    queryKey: ['fridgeSettings-home'],
    queryFn: async () => {
      const list = await db.entities.FridgeSettings.list();
      return list[0] || null;
    },
    initialData: null,
  });

  useEffect(() => {
    if (dbItems && dbItems.length > 0) setLocalItems(dbItems);
  }, [dbItems]);

  useEffect(() => {
    if (dbSettings) setSettings({ ...DEFAULT_SETTINGS, ...dbSettings });
  }, [dbSettings]);

  // Mutations
  const createItem = useMutation({
    mutationFn: item => db.entities.FridgeItem.create(item),
    onSuccess: () => queryClient.invalidateQueries(['fridgeItems-home']),
  });

  const updateItem = useMutation({
    mutationFn: ({ id, data }) => db.entities.FridgeItem.update(id, data),
    onSuccess: () => queryClient.invalidateQueries(['fridgeItems-home']),
  });

  const deleteItem = useMutation({
    mutationFn: id => db.entities.FridgeItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['fridgeItems-home']),
  });

  const saveSettings = useMutation({
    mutationFn: async (s) => {
      if (dbSettings?.id) return db.entities.FridgeSettings.update(dbSettings.id, s);
      return db.entities.FridgeSettings.create(s);
    },
    onSuccess: () => queryClient.invalidateQueries(['fridgeSettings-home']),
  });

  // Handlers
  const handleAddItem = useCallback((newItem) => {
    const tempId = `temp-${Date.now()}`;
    const item = {
      ...newItem,
      id: tempId,
      position_x: newItem.position_x ?? (15 + Math.random() * 55),
      position_y: newItem.position_y ?? (15 + Math.random() * 55),
      rotation: settings.random_rotation ? (-6 + Math.random() * 12) : 0,
    };
    setLocalItems(prev => [...prev, item]);
    setNewItemIds(prev => new Set([...prev, tempId]));
    setTimeout(() => setNewItemIds(prev => { const n = new Set(prev); n.delete(tempId); return n; }), 700);
    createItem.mutate(item);
  }, [settings.random_rotation, createItem]);

  const handlePositionChange = useCallback((id, x, y) => {
    setLocalItems(prev => prev.map(i => i.id === id ? { ...i, position_x: x, position_y: y } : i));
    if (id && !id.startsWith('s') && !id.startsWith('temp-')) {
      updateItem.mutate({ id, data: { position_x: x, position_y: y } });
    }
  }, [updateItem]);

  const handleSaveItem = useCallback((updated) => {
    setLocalItems(prev => prev.map(i => i.id === updated.id ? updated : i));
    if (updated.id && !updated.id.startsWith('s') && !updated.id.startsWith('temp-')) {
      updateItem.mutate({ id: updated.id, data: updated });
    }
  }, [updateItem]);

  const handleDeleteItem = useCallback((item) => {
    setLocalItems(prev => prev.filter(i => i.id !== item.id));
    if (item.id && !item.id.startsWith('s') && !item.id.startsWith('temp-')) {
      deleteItem.mutate(item.id);
    }
  }, [deleteItem]);

  const handlePinItem = useCallback((item) => {
    const updated = { ...item, is_pinned: !item.is_pinned };
    handleSaveItem(updated);
  }, [handleSaveItem]);

  const handleDuplicateItem = useCallback((item) => {
    const dup = {
      ...item,
      id: undefined,
      position_x: Math.min(80, (item.position_x || 0) + 5),
      position_y: Math.min(80, (item.position_y || 0) + 5),
      rotation: item.rotation + (-2 + Math.random() * 4),
    };
    handleAddItem(dup);
  }, [handleAddItem]);

  const handleCleanLayout = useCallback(() => {
    const cols = 5;
    const updated = localItems.map((item, i) => ({
      ...item,
      position_x: (i % cols) * 18 + 3,
      position_y: Math.floor(i / cols) * 22 + 8,
      rotation: 0,
    }));
    setLocalItems(updated);
  }, [localItems]);

  const handleAssistantAction = useCallback((actionId) => {
    if (actionId === 'clean') {
      // Align items in grid, remove overlap, reset rotation
      const cols = 5;
      const updated = localItems.map((item, i) => ({
        ...item,
        position_x: (i % cols) * 18 + 4,
        position_y: Math.floor(i / cols) * 22 + 8,
        rotation: (-1 + Math.random() * 2),
      }));
      setLocalItems(updated);
    } else if (actionId === 'group') {
      // Group by type: notes left, links center, photos right
      const notes = localItems.filter(i => i.type === 'sticky_note');
      const links = localItems.filter(i => i.type === 'link');
      const photos = localItems.filter(i => i.type === 'photo');
      const others = localItems.filter(i => !['sticky_note','link','photo'].includes(i.type));
      const arrange = (items, startX) => items.map((item, i) => ({
        ...item,
        position_x: startX + (i % 2) * 16,
        position_y: 10 + Math.floor(i / 2) * 22,
        rotation: -3 + Math.random() * 6,
      }));
      setLocalItems([
        ...arrange(notes, 4),
        ...arrange(links, 38),
        ...arrange(photos, 68),
        ...others,
      ]);
    } else if (actionId === 'today') {
      setFocusMode(true);
      setFocusFilter('today');
      setShowAssistant(false);
    } else if (actionId === 'highlight') {
      // Bring pinned items to front and add visual emphasis via focus mode
      setFocusMode(true);
      setFocusFilter('pinned');
      setShowAssistant(false);
    } else if (actionId === 'organize') {
      // Sort by type zones visually
      const typeOrder = ['sticky_note', 'link', 'photo', 'sticker', 'drawing', 'widget'];
      const sorted = [...localItems].sort((a, b) => typeOrder.indexOf(a.type) - typeOrder.indexOf(b.type));
      const cols = 5;
      const updated = sorted.map((item, i) => ({
        ...item,
        position_x: (i % cols) * 18 + 4,
        position_y: Math.floor(i / cols) * 22 + 8,
        rotation: -2 + Math.random() * 4,
      }));
      setLocalItems(updated);
    }
  }, [localItems]);

  const handleSettingsChange = useCallback((newSettings) => {
    setSettings(newSettings);
    saveSettings.mutate(newSettings);
  }, [saveSettings]);

  // Keyboard shortcut F for focus mode
  useEffect(() => {
    const handler = (e) => {
      if (e.key === 'f' && !e.target.matches('input,textarea')) {
        setFocusMode(v => !v);
      }
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, []);

  // Filter items by search + focus mode
  const now = new Date();
  const todayStr = now.toDateString();

  const visibleItems = localItems.filter(item => {
    // Search filter
    if (searchQuery) {
      const q = searchQuery.toLowerCase();
      if (!item.title?.toLowerCase().includes(q) && !item.content?.toLowerCase().includes(q)) return false;
    }
    // Focus mode filter
    if (focusMode) {
      if (!focusFilter) return item.is_pinned; // default: pinned only
      if (focusFilter === 'pinned') return item.is_pinned;
      if (focusFilter === 'recent') {
        // Show top 3 most recently updated (or pinned)
        return item.is_pinned;
      }
      if (focusFilter === 'today') {
        const updated = item.updated_date ? new Date(item.updated_date).toDateString() : null;
        const created = item.created_date ? new Date(item.created_date).toDateString() : null;
        return item.is_pinned || updated === todayStr || created === todayStr;
      }
    }
    return true;
  });

  // For "recent" mode: take pinned + top 2 by updated_date
  const focusVisibleItems = (focusMode && focusFilter === 'recent')
    ? (() => {
        const pinned = localItems.filter(i => i.is_pinned);
        const recent = [...localItems]
          .filter(i => !i.is_pinned)
          .sort((a, b) => new Date(b.updated_date || 0) - new Date(a.updated_date || 0))
          .slice(0, 2);
        const ids = new Set([...pinned, ...recent].map(i => i.id));
        return localItems.filter(i => ids.has(i.id));
      })()
    : visibleItems;

  return (
    <NewFridgeSurface fridgeStyle={settings.fridge_style} bgTheme={settings.bg_theme}>
      {/* Focus Mode bar */}
      {focusMode && (
        <FocusModeBar
          onExit={() => setFocusMode(false)}
          focusFilter={focusFilter}
          onFilterChange={setFocusFilter}
        />
      )}
      {/* Focus mode dim overlay */}
      {focusMode && (
        <div className="fixed inset-0 z-10 bg-black/20 pointer-events-none transition-opacity duration-300" />
      )}

      {/* Top Bar */}
      <div className="rounded-2xl border border-white/70 shadow-topbar mb-5 px-4" style={{ background: 'rgba(255,255,255,0.68)', backdropFilter: 'blur(18px)', WebkitBackdropFilter: 'blur(18px)' }}>
        <TopBar
          onAddItem={() => { setSpawnPos(null); setShowAdd(true); }}
          onToggleFocus={() => setFocusMode(f => !f)}
          focusMode={focusMode}
          onOpenAssistant={() => setShowAssistant(true)}
          onOpenSettings={() => setShowSettings(true)}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />
      </div>

      {/* Main area */}
      <div className="flex gap-4 relative">
        {/* Fridge canvas */}
        <div
          ref={canvasRef}
          className="flex-1 relative"
          style={{ minHeight: 'calc(100vh - 140px)' }}
          onDoubleClick={(e) => {
            if (e.target === canvasRef.current || e.target.closest('[data-canvas]')) {
              const rect = canvasRef.current.getBoundingClientRect();
              const px = ((e.clientX - rect.left) / rect.width) * 100;
              const py = ((e.clientY - rect.top) / rect.height) * 100;
              setSpawnPos({ x: Math.max(5, Math.min(85, px)), y: Math.max(5, Math.min(85, py)) });
              setShowAdd(true);
            }
          }}
          data-canvas
        >
          {localItems.map(item => {
            const isVisible = focusVisibleItems.some(v => v.id === item.id);
            return (
              <div
                key={item.id}
                className="transition-all duration-500"
                style={{
                  opacity: focusMode && !isVisible ? 0.1 : 1,
                  filter: focusMode && !isVisible ? 'blur(1px)' : 'none',
                  pointerEvents: focusMode && !isVisible ? 'none' : 'auto',
                  position: 'absolute',
                  left: 0, top: 0, width: '100%', height: '100%',
                  zIndex: focusMode && isVisible ? 20 : undefined,
                }}
              >
                <FridgeItemWrapper
                  item={item}
                  onPositionChange={handlePositionChange}
                  onEdit={setEditingItem}
                  onPin={handlePinItem}
                  onDuplicate={handleDuplicateItem}
                  onDelete={handleDeleteItem}
                  isNew={newItemIds.has(item.id)}
                  focusMode={focusMode}
                />
              </div>
            );
          })}

          {focusVisibleItems.length === 0 && searchQuery && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <p className="text-4xl mb-3">🔍</p>
                <p className="text-sm font-medium text-muted-foreground">No items match "{searchQuery}"</p>
              </div>
            </div>
          )}

          {localItems.length === 0 && !searchQuery && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center opacity-50">
                <p className="text-5xl mb-4">🧊</p>
                <p className="text-sm font-medium text-muted-foreground">Your fridge is empty</p>
                <p className="text-xs text-muted-foreground mt-1">Click "Add" to place your first item</p>
              </div>
            </div>
          )}
        </div>

        {/* Right panel */}
        {settings.show_right_panel !== false && (
          <RightPanel
            tasks={tasks}
            onToggleTask={(id) => setTasks(t => t.map(task => task.id === id ? { ...task, done: !task.done } : task))}
            onAddTask={(text) => setTasks(t => [...t, { id: `t${Date.now()}`, text, done: false }])}
          />
        )}
      </div>

      {/* Modals */}
      <AddItemPopup
        isOpen={showAdd}
        onClose={() => { setShowAdd(false); setSpawnPos(null); }}
        onAdd={handleAddItem}
        spawnX={spawnPos?.x}
        spawnY={spawnPos?.y}
      />

      <EditItemDrawer
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
        onDuplicate={handleDuplicateItem}
      />

      <FridgeAssistant
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        onAction={handleAssistantAction}
      />

      <SettingsPanel
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onChange={handleSettingsChange}
      />
    </NewFridgeSurface>
  );
}