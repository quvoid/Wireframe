import { useEffect, useState } from 'react';
import { useProjectStore } from './store/projectStore';
import { Layout, MousePointer2 } from 'lucide-react';
import { Canvas } from './components/canvas/Canvas';
import { Sidebar } from './components/editor/Sidebar';
import { DndContext, DragOverlay, useSensor, useSensors, PointerSensor, type DragEndEvent, type DragStartEvent } from '@dnd-kit/core';
import { WireframeComponentRenderer } from './components/wireframe/WireframeComponentRenderer';
import type { WireframeComponent } from './types';

function App() {
  const { activeScreenId, project, addScreen, screens, addComponent } = useProjectStore(state => ({
    activeScreenId: state.activeScreenId,
    project: state.project,
    addScreen: state.addScreen,
    screens: state.project.screens,
    addComponent: state.addComponent
  }));

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
    if (screens.length === 0) {
      addScreen();
    }
  }, [screens.length, addScreen]);

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
        }

        addComponent(screenId, {
          type,
          name: type,
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
          { text: 'Text' }
  } : null;

  return (
    <DndContext sensors={sensors} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="h-screen w-full bg-neutral-900 text-white flex flex-col overflow-hidden font-sans">
        {/* Header */}
        <header className="h-14 border-b border-neutral-800 flex items-center px-4 justify-between bg-neutral-900 z-10">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
              <Layout size={20} className="text-white" />
            </div>
            <span className="font-semibold text-lg">{project.name}</span>
          </div>
          <div className="flex items-center gap-4 text-sm text-neutral-400">
            <span>{project.screens.length} Screens</span>
            <div className="h-4 w-[1px] bg-neutral-700"></div>
            <span>Draft</span>
          </div>
        </header>

        {/* Main Workspace */}
        <div className="flex-1 flex overflow-hidden">
          <Sidebar />

          {/* Center - Canvas Area */}
          <main className="flex-1 bg-neutral-950 relative overflow-hidden flex flex-col">
            <Canvas />
          </main>

          {/* Right Sidebar - Properties */}
          <aside className="w-72 border-l border-neutral-800 bg-neutral-900 flex flex-col z-20">
            <div className="p-4 border-b border-neutral-800">
              <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Properties</h2>
            </div>
            <div className="flex-1 p-4 text-sm text-neutral-400">
              <div className="flex items-center gap-2 mb-4">
                <MousePointer2 size={16} />
                <span>Select an element to edit</span>
              </div>

              {activeScreenId && (
                <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-xs">Screen Name</label>
                    <input type="text" className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white" value="Screen 1" readOnly />
                  </div>
                  <div className="space-y-2">
                    <label className="text-xs">Device Preset</label>
                    <select className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-white">
                      <option>iPhone 14 Pro</option>
                    </select>
                  </div>
                </div>
              )}
            </div>
          </aside>
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
