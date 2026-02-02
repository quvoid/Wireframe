import { useEffect } from 'react';
import { useProjectStore } from './store/projectStore';
import { Layout, MousePointer2 } from 'lucide-react';
import { Canvas } from './components/canvas/Canvas';

function App() {
  const { activeScreenId, project, addScreen, screens } = useProjectStore(state => ({
    activeScreenId: state.activeScreenId,
    project: state.project,
    addScreen: state.addScreen,
    screens: state.project.screens
  }));

  useEffect(() => {
    // Add a default screen if none exists
    if (screens.length === 0) {
      addScreen();
    }
  }, [screens.length, addScreen]);

  return (
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
        {/* Left Sidebar - Components */}
        <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col">
          <div className="p-4 border-b border-neutral-800">
            <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Components</h2>
          </div>
          <div className="flex-1 p-2">
            <div className="p-3 bg-neutral-800 rounded mb-2 cursor-pointer hover:bg-neutral-700 transition">
              Button
            </div>
            <div className="p-3 bg-neutral-800 rounded mb-2 cursor-pointer hover:bg-neutral-700 transition">
              Input
            </div>
            <div className="p-3 bg-neutral-800 rounded mb-2 cursor-pointer hover:bg-neutral-700 transition">
              Card
            </div>
          </div>
        </aside>

        {/* Center - Canvas Area */}
        <main className="flex-1 bg-neutral-950 relative overflow-hidden flex flex-col">
          <Canvas />
        </main>

        {/* Right Sidebar - Properties */}
        <aside className="w-72 border-l border-neutral-800 bg-neutral-900 flex flex-col">
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
  );
}

export default App;
