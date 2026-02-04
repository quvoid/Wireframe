import { useEffect, useState } from 'react';
import { useProjectStore } from './store/projectStore';
import { Layout, Undo, Redo } from 'lucide-react';
import { Canvas } from './components/canvas/Canvas';
import { Sidebar } from './components/editor/Sidebar';
import { PropertiesPanel } from './components/editor/PropertiesPanel';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { WireframeComponentRenderer } from './components/wireframe/WireframeComponentRenderer';
import type { WireframeComponent } from './types';

function App() {
  const project = useProjectStore(state => state.project);
  const addScreen = useProjectStore(state => state.addScreen);
  const screensLength = useProjectStore(state => state.project.screens.length);
  const addComponent = useProjectStore(state => state.addComponent);

  const undo = useProjectStore(state => state.undo);
  const redo = useProjectStore(state => state.redo);
  const canUndo = useProjectStore(state => state.canUndo());
  const canRedo = useProjectStore(state => state.canRedo());

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Undo: Ctrl+Z
      if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
        e.preventDefault();
        if (canUndo) undo();
      }

      // Redo: Ctrl+Y or Ctrl+Shift+Z
      if (
        ((e.ctrlKey || e.metaKey) && e.key === 'y') ||
        ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'z') ||
        ((e.ctrlKey || e.metaKey) && e.key === 'Z') // Shift+z usually results in Z
      ) {
        e.preventDefault();
        if (canRedo) redo();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [undo, redo, canUndo, canRedo]);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const [activeDragType, setActiveDragType] = useState<string | null>(null);

  useEffect(() => {
    // Add a default screen if none exists
    if (screensLength === 0) {
      addScreen();
    }
  }, [screensLength, addScreen]);

  const handleDragStart = (event: DragStartEvent) => {
    if (event.active.data.current?.isSidebarItem) {
      setActiveDragType(event.active.data.current.type);
    }
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveDragType(null);
    const { active, over } = event;

    if (!over) return;

    if (active.data.current?.isSidebarItem) {
      const type = active.data.current.type;
      const screenId = over.id as string;

      // Calculate relative position
      const screenElement = document.getElementById(screenId);
      if (screenElement && active.rect.current.translated) {
        const screenRect = screenElement.getBoundingClientRect();
        const dropRect = active.rect.current.translated;

        // Calculate position relative to the screen content area (accounting for pt-10 if needed, but absolute is easier)
        // The div is relative, components are absolute.
        // Top-left of div is 0,0.
        let x = dropRect.left - screenRect.left;
        let y = dropRect.top - screenRect.top;

        // Account for component dimensions to center it?
        // Dnd-kit translates top-left usually? 
        // Yes, dropRect is the dragged item's rect.

        // Basic clamping
        if (x < 0) x = 0;
        if (y < 0) y = 0;

        // Default props based on type
        let size = { width: 120, height: 40 };
        let properties: any = { text: 'Button' };

        if (type === 'input') {
          size = { width: 200, height: 60 };
          properties = { label: 'Label', placeholder: 'Placeholder' };
        } else if (type === 'card') {
          size = { width: 240, height: 160 };
          properties = { title: 'Card Title' };
        } else if (type === 'text') {
          size = { width: 100, height: 30 };
          properties = { text: 'TextBlock', fontSize: 16 };
        } else if (type === 'image') {
          size = { width: 100, height: 100 };
          properties = { text: 'Image' };
        } else if (type === 'avatar') {
          size = { width: 60, height: 60 };
          properties = { borderRadius: 'full' };
        } else if (type === 'toggle') {
          size = { width: 44, height: 24 };
          properties = { value: false };
        } else if (type === 'checkbox') {
          size = { width: 24, height: 24 };
          properties = { value: false, label: 'Check' };
        } else if (type === 'line') {
          size = { width: 200, height: 20 };
          properties = {};
        }

        addComponent(screenId, {
          type,
          name: type.charAt(0).toUpperCase() + type.slice(1),
          position: { x, y },
          size,
          properties,
          style: {}
        });
      }
    }
  };

  // Mock component for overlay
  const dragOverlayComponent: WireframeComponent | null = activeDragType ? {
    id: 'preview',
    type: activeDragType,
    name: 'Preview',
    position: { x: 0, y: 0 },
    size: { width: 0, height: 0 }, // Size not used by renderer directly usually for layout, but renderer style might use w-full h-full
    properties: activeDragType === 'button' ? { text: 'Button', variant: 'primary' } :
      activeDragType === 'input' ? { label: 'Label', placeholder: 'Input' } :
        activeDragType === 'card' ? { title: 'Card' } :
          activeDragType === 'image' ? { text: 'Image' } :
            activeDragType === 'avatar' ? { borderRadius: 'full' } :
              { text: 'Text' }
  } : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen w-full bg-neutral-900 text-white flex flex-col overflow-hidden font-sans">
        {/* Header */}
        <header className="h-16 border-b border-neutral-800 flex items-center px-6 justify-between bg-neutral-900/80 backdrop-blur-md z-30 fixed top-0 left-0 right-0">
          <div className="flex items-center gap-4">
            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-900/20">
              <Layout size={20} className="text-white" />
            </div>
            <div>
              <h1 className="font-semibold text-sm leading-none mb-1">{project.name}</h1>
              <span className="text-[10px] text-neutral-500 uppercase tracking-wider font-semibold">Dashboard Prototype</span>
            </div>
          </div>

          <div className="flex items-center gap-6 text-sm text-neutral-400">
            <div className="flex items-center gap-1 bg-neutral-800/50 p-1 rounded-lg border border-neutral-800">
              <button
                className={`p-2 rounded-md hover:bg-neutral-700 transition-colors ${!canUndo ? 'opacity-30 cursor-not-allowed' : 'text-neutral-200'}`}
                onClick={undo}
                disabled={!canUndo}
                title="Undo (Ctrl+Z)"
              >
                <Undo size={16} />
              </button>
              <div className="w-[1px] h-4 bg-neutral-700 mx-1"></div>
              <button
                className={`p-2 rounded-md hover:bg-neutral-700 transition-colors ${!canRedo ? 'opacity-30 cursor-not-allowed' : 'text-neutral-200'}`}
                onClick={redo}
                disabled={!canRedo}
                title="Redo (Ctrl+Y)"
              >
                <Redo size={16} />
              </button>
            </div>

            <div className="flex items-center gap-4">
              <span className="text-xs">{screensLength} Screens</span>
              <div className="px-2 py-0.5 bg-neutral-800 text-neutral-400 text-[10px] font-bold uppercase tracking-wider rounded-full border border-neutral-700">
                Draft
              </div>
            </div>

            <button className="bg-white text-black px-4 py-1.5 rounded-md text-xs font-semibold hover:bg-neutral-200 transition-colors">
              Share
            </button>
          </div>
        </header>

        {/* Main Workspace - Added top padding for fixed header */}
        <div className="flex-1 flex overflow-hidden pt-16">
          <Sidebar />

          {/* Center - Canvas Area */}
          <main className="flex-1 bg-neutral-950 relative overflow-hidden flex flex-col shadow-inner">
            <Canvas />
          </main>

          {/* Right Sidebar - Properties */}
          <PropertiesPanel />
        </div>
      </div>
      <DragOverlay>
        {activeDragType ? (
          <div className="w-32 h-12 opacity-80">
            <WireframeComponentRenderer component={dragOverlayComponent!} />
          </div>
        ) : null}
      </DragOverlay>
    </DndContext>
  );
}

export default App;
