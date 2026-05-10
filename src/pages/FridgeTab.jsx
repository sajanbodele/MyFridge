const db = globalThis.__B44_DB__ || { auth:{ isAuthenticated: async()=>false, me: async()=>null }, entities:new Proxy({}, { get:()=>({ filter:async()=>[], get:async()=>null, create:async()=>({}), update:async()=>({}), delete:async()=>({}) }) }), integrations:{ Core:{ UploadFile:async()=>({ file_url:'' }) } } };

import React, { useState, useEffect } from 'react';
import { Plus, Settings, Sparkles } from 'lucide-react';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';

import FridgeSurface from '@/components/fridge/FridgeSurface';
import SearchBar from '@/components/fridge/SearchBar';
import DraggableItem from '@/components/fridge/DraggableItem';
import BookmarkMagnet from '@/components/fridge/BookmarkMagnet';
import StickyNote from '@/components/fridge/StickyNote';
import PhotoFrame from '@/components/fridge/PhotoFrame';
import ClockWidget from '@/components/fridge/widgets/ClockWidget';
import WeatherWidget from '@/components/fridge/widgets/WeatherWidget';
import QuoteWidget from '@/components/fridge/widgets/QuoteWidget';
import GroceryWidget from '@/components/fridge/widgets/GroceryWidget';
import CalendarWidget from '@/components/fridge/widgets/CalendarWidget';
import TodoWidget from '@/components/fridge/widgets/TodoWidget';
import PhotoSlideshow from '@/components/fridge/widgets/PhotoSlideshow';
import MusicPlayer from '@/components/fridge/widgets/MusicPlayer';
import CalculatorWidget from '@/components/fridge/widgets/CalculatorWidget';
import WhiteboardWidget from '@/components/fridge/widgets/WhiteboardWidget';
import RealTimeWeatherWidget from '@/components/fridge/widgets/RealTimeWeatherWidget';
import AddItemModal from '@/components/fridge/AddItemModal';
import SettingsDrawer from '@/components/fridge/SettingsDrawer';
import ContextMenu from '@/components/fridge/ContextMenu';
import EditItemModal from '@/components/fridge/EditItemModal';
import DrawingCanvas from '@/components/fridge/DrawingCanvas';
import SmartTV from '@/components/fridge/SmartTV';
import FridgeAssistant from '@/components/fridge/FridgeAssistant';
import FridgeSwitcher from '@/components/fridge/FridgeSwitcher';
import CollaboratorAvatars from '@/components/fridge/CollaboratorAvatars';
import Magnet from '@/components/fridge/Magnet';
import MinimizedWidget from '@/components/fridge/MinimizedWidget';

const defaultSettings = {
  fridge_style: 'stainless_steel',
  show_kitchen_bg: false,
  enable_sounds: true,
  magnet_physics: true,
  show_smart_tv: false
};

const defaultItems = [
  { id: 'default-1', type: 'widget', widget_type: 'clock', position_x: 75, position_y: 8, rotation: -2 },
  { id: 'default-2', type: 'widget', widget_type: 'weather', position_x: 5, position_y: 5, rotation: 3 },
  { id: 'default-3', type: 'bookmark', title: 'Google', content: 'https://google.com', magnet_color: 'red', magnet_shape: 'circle', position_x: 5, position_y: 75, rotation: -5 },
  { id: 'default-4', type: 'bookmark', title: 'YouTube', content: 'https://youtube.com', magnet_color: 'blue', magnet_shape: 'star', position_x: 15, position_y: 78, rotation: 8 },
  { id: 'default-5', type: 'sticky_note', content: 'Welcome to FridgeTab! 🧊\n\nDrag items around, add bookmarks, and customize your fridge!', note_color: 'yellow', position_x: 35, position_y: 55, rotation: -3 },
  { id: 'default-6', type: 'widget', widget_type: 'quote', position_x: 60, position_y: 65, rotation: 2 }
];

export default function FridgeTab() {
  const queryClient = useQueryClient();
  const [items, setItems] = useState(defaultItems);
  const [settings, setSettings] = useState(defaultSettings);
  const [showAddModal, setShowAddModal] = useState(false);
  const [showSettings, setShowSettings] = useState(false);
  const [contextMenu, setContextMenu] = useState(null);
  const [editingItem, setEditingItem] = useState(null);
  const [showDrawing, setShowDrawing] = useState(false);
  const [showAssistant, setShowAssistant] = useState(false);
  const [newItemIds, setNewItemIds] = useState(new Set());
  const [currentFridge, setCurrentFridge] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);

  // Fetch current user
  useEffect(() => {
    db.auth.me().then(setCurrentUser).catch(() => {});
  }, []);

  // Fetch shared fridges
  const { data: sharedFridges = [] } = useQuery({
    queryKey: ['sharedFridges'],
    queryFn: async () => {
      const user = await db.auth.me();
      const all = await db.entities.SharedFridge.list();
      return all.filter(f => f.owner_email === user.email || f.collaborators?.includes(user.email));
    },
    enabled: !!currentUser
  });

  // Fetch items from database (filtered by current fridge)
  const { data: dbItems, refetch: refetchItems } = useQuery({
    queryKey: ['fridgeItems', currentFridge?.id],
    queryFn: async () => {
      const allItems = await db.entities.FridgeItem.list();
      if (currentFridge) {
        return allItems.filter(i => i.fridge_id === currentFridge.id);
      }
      return allItems.filter(i => !i.fridge_id);
    },
    initialData: [],
    refetchInterval: currentFridge ? 3000 : false // Poll for updates on shared fridges
  });

  // Fetch settings
  const { data: dbSettings } = useQuery({
    queryKey: ['fridgeSettings'],
    queryFn: async () => {
      const settingsList = await db.entities.FridgeSettings.list();
      return settingsList[0] || null;
    },
    initialData: null
  });

  useEffect(() => {
    if (dbItems && dbItems.length > 0) {
      setItems(dbItems);
    }
  }, [dbItems]);

  useEffect(() => {
    if (dbSettings) {
      setSettings({ ...defaultSettings, ...dbSettings });
    }
  }, [dbSettings]);

  // Mutations
  const createItemMutation = useMutation({
    mutationFn: (item) => db.entities.FridgeItem.create({
      ...item,
      fridge_id: currentFridge?.id || null,
      last_edited_by: currentUser?.email
    }),
    onSuccess: () => queryClient.invalidateQueries(['fridgeItems', currentFridge?.id])
  });

  const createFridgeMutation = useMutation({
    mutationFn: (name) => db.entities.SharedFridge.create({
      name,
      owner_email: currentUser?.email,
      collaborators: []
    }),
    onSuccess: () => queryClient.invalidateQueries(['sharedFridges'])
  });

  const inviteToFridgeMutation = useMutation({
    mutationFn: async ({ fridgeId, email }) => {
      const fridge = sharedFridges.find(f => f.id === fridgeId);
      const collaborators = [...(fridge.collaborators || []), email];
      return db.entities.SharedFridge.update(fridgeId, { collaborators });
    },
    onSuccess: () => queryClient.invalidateQueries(['sharedFridges'])
  });

  const deleteFridgeMutation = useMutation({
    mutationFn: (fridgeId) => db.entities.SharedFridge.delete(fridgeId),
    onSuccess: (_, fridgeId) => {
      if (currentFridge?.id === fridgeId) setCurrentFridge(null);
      queryClient.invalidateQueries(['sharedFridges']);
    }
  });

  const updateItemMutation = useMutation({
    mutationFn: ({ id, data }) => db.entities.FridgeItem.update(id, {
      ...data,
      last_edited_by: currentUser?.email
    }),
    onSuccess: () => queryClient.invalidateQueries(['fridgeItems', currentFridge?.id])
  });

  const deleteItemMutation = useMutation({
    mutationFn: (id) => db.entities.FridgeItem.delete(id),
    onSuccess: () => queryClient.invalidateQueries(['fridgeItems', currentFridge?.id])
  });

  const saveSettingsMutation = useMutation({
    mutationFn: async (newSettings) => {
      if (dbSettings?.id) {
        return db.entities.FridgeSettings.update(dbSettings.id, newSettings);
      } else {
        return db.entities.FridgeSettings.create(newSettings);
      }
    },
    onSuccess: () => queryClient.invalidateQueries(['fridgeSettings'])
  });

  const handleAddItem = (newItem) => {
    // Handle drawing type - open canvas instead
    if (newItem.type === 'drawing') {
      setShowAddModal(false);
      setShowDrawing(true);
      return;
    }

    const tempId = `temp-${Date.now()}`;
    const itemToCreate = {
      type: newItem.type,
      title: newItem.title,
      content: newItem.type === 'bookmark' ? newItem.url : newItem.content,
      position_x: newItem.position_x,
      position_y: newItem.position_y,
      rotation: newItem.rotation,
      magnet_shape: newItem.magnetShape,
      magnet_color: newItem.magnetColor,
      note_color: newItem.noteColor,
      widget_type: newItem.widgetType,
      widget_theme: newItem.widgetTheme,
      z_index: items.length
    };
    
    createItemMutation.mutate(itemToCreate);
    
    // Track new items for animation
    setNewItemIds(prev => new Set([...prev, tempId]));
    setTimeout(() => setNewItemIds(prev => {
      const next = new Set(prev);
      next.delete(tempId);
      return next;
    }), 600);
    
    // Optimistic update
    setItems([...items, { ...itemToCreate, id: tempId }]);
  };

  const handleDrawingSave = (imageUrl) => {
    const tempId = `temp-${Date.now()}`;
    const drawingItem = {
      type: 'drawing',
      content: imageUrl,
      position_x: 30 + Math.random() * 30,
      position_y: 30 + Math.random() * 30,
      rotation: -5 + Math.random() * 10,
      magnet_color: 'purple',
      z_index: items.length
    };
    
    createItemMutation.mutate(drawingItem);
    
    setNewItemIds(prev => new Set([...prev, tempId]));
    setTimeout(() => setNewItemIds(prev => {
      const next = new Set(prev);
      next.delete(tempId);
      return next;
    }), 600);
    
    setItems([...items, { ...drawingItem, id: tempId }]);
  };

  const handlePositionChange = (id, x, y) => {
    const item = items.find(i => i.id === id);
    if (item && item.id && !item.id.startsWith('default-') && !item.id.startsWith('temp-')) {
      updateItemMutation.mutate({ id, data: { position_x: x, position_y: y } });
    }
    setItems(items.map(i => i.id === id ? { ...i, position_x: x, position_y: y } : i));
  };

  const handleContextMenu = (e, item) => {
    e.preventDefault();
    setContextMenu({ x: e.clientX, y: e.clientY, item });
  };

  const handleDeleteItem = (item) => {
    const targetItem = item || contextMenu?.item;
    if (targetItem) {
      const id = targetItem.id;
      if (id && !id.toString().startsWith('default-') && !id.toString().startsWith('temp-')) {
        deleteItemMutation.mutate(id);
      }
      setItems(items.filter(i => i.id !== id));
    }
  };

  const handleDuplicateItem = () => {
    if (contextMenu?.item) {
      const original = contextMenu.item;
      const duplicate = {
        ...original,
        id: undefined,
        position_x: (original.position_x + 5) % 85,
        position_y: (original.position_y + 5) % 85
      };
      handleAddItem(duplicate);
    }
  };

  const handleEditItem = (item) => {
    const targetItem = item || contextMenu?.item;
    if (targetItem && ['bookmark', 'sticky_note', 'photo'].includes(targetItem.type)) {
      setEditingItem(targetItem);
    }
  };

  const handleSaveItem = (updatedItem) => {
    if (updatedItem.id && !updatedItem.id.toString().startsWith('default-') && !updatedItem.id.toString().startsWith('temp-')) {
      updateItemMutation.mutate({ id: updatedItem.id, data: updatedItem });
    }
    setItems(items.map(i => i.id === updatedItem.id ? updatedItem : i));
  };

  const handleMinimizeWidget = (item) => {
    const updatedItem = { ...item, is_minimized: true };
    handleSaveItem(updatedItem);
  };

  const handleRestoreWidget = (item) => {
    const updatedItem = { ...item, is_minimized: false };
    handleSaveItem(updatedItem);
  };

  const handleDoubleClick = (item) => {
    if (['bookmark', 'sticky_note', 'photo', 'drawing'].includes(item.type)) {
      setEditingItem(item);
    }
  };

  const handleSettingsChange = (newSettings) => {
    setSettings(newSettings);
    saveSettingsMutation.mutate(newSettings);
  };

  const renderItem = (item) => {
    // Handle minimized widgets
    if (item.type === 'widget' && item.is_minimized) {
      return (
        <MinimizedWidget
          widgetType={item.widget_type}
          customIcon={item.minimized_icon}
          onRestore={() => handleRestoreWidget(item)}
        />
      );
    }

    const widgetTheme = item.widget_theme || 'default';

    switch (item.type) {
      case 'bookmark':
        return (
          <BookmarkMagnet
            url={item.content}
            title={item.title}
            magnetColor={item.magnet_color}
            magnetShape={item.magnet_shape}
            letter={item.title?.[0]}
            onEdit={() => setEditingItem(item)}
          />
        );
      case 'sticky_note':
        return (
          <StickyNote
            content={item.content}
            color={item.note_color}
            onEdit={() => setEditingItem(item)}
          />
        );
      case 'photo':
        return (
          <PhotoFrame
            imageUrl={item.content}
            magnetColor={item.magnet_color}
            onEdit={() => setEditingItem(item)}
          />
        );
      case 'drawing':
        return (
          <PhotoFrame
            imageUrl={item.content}
            magnetColor={item.magnet_color || 'purple'}
            onEdit={() => setEditingItem(item)}
          />
        );
      case 'widget':
        switch (item.widget_type) {
          case 'clock':
            return <ClockWidget onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'weather':
            return <WeatherWidget weather="sunny" temperature={72} location="Your City" onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'quote':
            return <QuoteWidget onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'grocery':
            return <GroceryWidget onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'calendar':
            return <CalendarWidget onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'todo':
            return <TodoWidget onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'slideshow':
            return <PhotoSlideshow onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'music':
            return <MusicPlayer onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'calculator':
            return <CalculatorWidget onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'whiteboard':
            return <WhiteboardWidget onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          case 'realtime_weather':
            return <RealTimeWeatherWidget onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
          default:
            return <ClockWidget onMinimize={() => handleMinimizeWidget(item)} theme={widgetTheme} />;
        }
      default:
        return null;
    }
  };

  return (
    <FridgeSurface 
      style={settings.fridge_style} 
      showKitchenBg={settings.show_kitchen_bg}
      backgroundSettings={settings}
    >
      {/* Top bar with fridge switcher */}
      <div className="relative z-30 mb-4 flex items-center gap-3">
        <FridgeSwitcher
          fridges={sharedFridges}
          currentFridge={currentFridge}
          currentUser={currentUser}
          onSwitch={setCurrentFridge}
          onCreate={(name) => createFridgeMutation.mutate(name)}
          onInvite={(fridgeId, email) => inviteToFridgeMutation.mutate({ fridgeId, email })}
          onDelete={(id) => deleteFridgeMutation.mutate(id)}
        />
        {currentFridge && (
          <CollaboratorAvatars
            collaborators={currentFridge.collaborators}
            owner={currentFridge.owner_email}
            currentUser={currentUser?.email}
          />
        )}
        <div className="flex-1" />
        <SearchBar />
      </div>

      {/* Utility buttons */}
      <div className="absolute top-4 right-16 md:right-20 z-30 flex gap-2">
        <button
          onClick={() => setShowAssistant(true)}
          className="p-2.5 rounded-full bg-gradient-to-br from-violet-500 to-purple-600 text-white shadow-lg hover:scale-110 transition-transform"
          title="AI Assistant"
        >
          <Sparkles className="w-4 h-4" />
        </button>
        <button
          onClick={() => setShowSettings(true)}
          className="p-2.5 rounded-full bg-gradient-to-br from-slate-600 to-slate-800 text-white shadow-lg hover:scale-110 transition-transform"
        >
          <Settings className="w-4 h-4" />
        </button>
      </div>

      {/* Add Item Button */}
      <button
        onClick={() => setShowAddModal(true)}
        className="absolute bottom-6 right-16 md:right-20 z-30 group"
      >
        <div className="relative">
          <Magnet shape="circle" color="green" size="lg">
            <Plus className="w-6 h-6 text-white absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2" />
          </Magnet>
          <span className="absolute -bottom-8 left-1/2 -translate-x-1/2 whitespace-nowrap text-xs bg-gray-900/80 text-white px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity">
            Add Item
          </span>
        </div>
      </button>

      {/* Fridge Items */}
      <div className="absolute inset-0 overflow-hidden">
        {items.map((item) => (
          <DraggableItem
            key={item.id}
            id={item.id}
            initialX={item.position_x}
            initialY={item.position_y}
            rotation={item.rotation || 0}
            onPositionChange={handlePositionChange}
            onContextMenu={(e) => handleContextMenu(e, item)}
            onDoubleClick={() => handleDoubleClick(item)}
            enablePhysics={settings.magnet_physics}
            className={newItemIds.has(item.id) ? 'animate-float-in' : ''}
          >
            {renderItem(item)}
          </DraggableItem>
        ))}
      </div>

      {/* Modals */}
      <AddItemModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAdd={handleAddItem}
      />

      <SettingsDrawer
        isOpen={showSettings}
        onClose={() => setShowSettings(false)}
        settings={settings}
        onSettingsChange={handleSettingsChange}
      />

      <EditItemModal
        isOpen={!!editingItem}
        item={editingItem}
        onClose={() => setEditingItem(null)}
        onSave={handleSaveItem}
        onDelete={handleDeleteItem}
      />

      <DrawingCanvas
        isOpen={showDrawing}
        onClose={() => setShowDrawing(false)}
        onSave={handleDrawingSave}
      />

      <SmartTV
        isVisible={settings.show_smart_tv}
        onClose={() => handleSettingsChange({ ...settings, show_smart_tv: false })}
      />

      <FridgeAssistant
        isOpen={showAssistant}
        onClose={() => setShowAssistant(false)}
        items={items}
        onUpdateItem={handleSaveItem}
        onCreateItem={handleAddItem}
        mediaLibrary={[]}
      />

      {/* Context Menu */}
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onEdit={() => handleEditItem(contextMenu?.item)}
          onDuplicate={handleDuplicateItem}
          onDelete={handleDeleteItem}
          onMoveToFront={() => {}}
          onMoveToBack={() => {}}
        />
      )}

      {/* Custom font import */}
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Caveat:wght@400;500;600;700&family=Inter:wght@400;500;600;700&family=Poppins:wght@400;500;600;700&display=swap');
        
        @keyframes wiggle {
          0%, 100% { transform: rotate(0deg); }
          25% { transform: rotate(-3deg); }
          75% { transform: rotate(3deg); }
        }
        
        .animate-wiggle {
          animation: wiggle 0.3s ease-in-out;
        }
        
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-5px); }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        @keyframes float-in {
          0% { opacity: 0; transform: scale(0.3) translateY(-50px) rotate(-10deg); }
          60% { transform: scale(1.1) translateY(5px) rotate(3deg); }
          100% { opacity: 1; transform: scale(1) translateY(0) rotate(0deg); }
        }
        
        .animate-float-in {
          animation: float-in 0.5s cubic-bezier(0.34, 1.56, 0.64, 1);
        }
        
        @keyframes pop {
          0% { transform: scale(1); }
          50% { transform: scale(1.15); }
          100% { transform: scale(1); }
        }
      `}</style>
    </FridgeSurface>
  );
}