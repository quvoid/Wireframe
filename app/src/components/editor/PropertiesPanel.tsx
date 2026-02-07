import { useProjectStore } from '../../store/projectStore';
import { MousePointer2, Type, Layout, Trash2, ChevronDown, Layers, AppWindow, Palette, Plus } from 'lucide-react';
import { DEVICE_PRESETS } from '../../constants/presets';
import type { DevicePresetKey } from '../../constants/presets';

export function PropertiesPanel() {
    const activeScreenId = useProjectStore(state => state.activeScreenId);
    const selectedComponentIds = useProjectStore(state => state.selectedComponentIds);
    const updateComponent = useProjectStore(state => state.updateComponent);
    const updateScreen = useProjectStore(state => state.updateScreen);
    const removeComponent = useProjectStore(state => state.removeComponent);
    const project = useProjectStore(state => state.project);
    const updateTheme = useProjectStore(state => state.updateTheme);

    // Find the selected component
    // For now support single selection editing
    let selectedComponent = null;
    let activeScreen = null;

    if (activeScreenId) {
        activeScreen = project.screens.find(s => s.id === activeScreenId);
        if (activeScreen && selectedComponentIds.length === 1) {
            selectedComponent = activeScreen.components.find(c => c.id === selectedComponentIds[0]);
        }
    }

    const handlePropChange = (key: string, value: any) => {
        if (selectedComponent && activeScreen) {
            updateComponent(activeScreen.id, selectedComponent.id, {
                properties: {
                    ...selectedComponent.properties,
                    [key]: value
                }
            });
        }
    };

    const handlePosChange = (key: 'x' | 'y', value: number) => {
        if (selectedComponent && activeScreen) {
            updateComponent(activeScreen.id, selectedComponent.id, {
                position: {
                    ...selectedComponent.position,
                    [key]: value
                }
            });
        }
    };

    if (!activeScreenId) {
        return (
            <aside className="w-full h-full bg-neutral-900 flex flex-col z-20">
                <div className="flex-1 flex flex-col items-center justify-center text-neutral-500 text-sm gap-4">
                    <span>No Screen Selected</span>
                    <button
                        onClick={() => useProjectStore.getState().addScreen()}
                        className="flex items-center gap-2 py-2 px-4 bg-blue-600 hover:bg-blue-500 text-white rounded-md text-xs font-semibold shadow-sm transition-all active:scale-95"
                    >
                        <Plus size={14} />
                        Create New Screen
                    </button>
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-full h-full bg-neutral-900/95 backdrop-blur-sm flex flex-col z-20 shadow-xl overflow-hidden">
            {/* Header */}
            <div className="h-10 px-4 border-b border-neutral-800 flex items-center bg-neutral-900/50">
                <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest">Properties</h2>
            </div>

            <div className="flex-1 overflow-y-auto no-scrollbar">
                {!selectedComponent ? (
                    <div className="flex flex-col items-center justify-center h-64 text-neutral-600 text-sm gap-3 p-8 text-center">
                        <div className="w-12 h-12 bg-neutral-800/50 rounded-full flex items-center justify-center mb-2">
                            <MousePointer2 size={20} className="opacity-40" />
                        </div>
                        <p>Select an element on the canvas to edit its properties</p>
                    </div>
                ) : (
                    <div className="pb-8">
                        {/* Info Header */}
                        <div className="px-4 py-3 border-b border-neutral-800 bg-neutral-800/20">
                            <div className="flex items-center justify-between">
                                <span className="font-medium text-sm capitalize flex items-center gap-2 text-white">
                                    {selectedComponent.type === 'button' && <MousePointer2 size={14} className="text-blue-400" />}
                                    {selectedComponent.type === 'input' && <Type size={14} className="text-green-400" />}
                                    {selectedComponent.type}
                                </span>
                                <span className="text-[10px] text-neutral-500 font-mono bg-neutral-900 px-1.5 py-0.5 rounded border border-neutral-800">
                                    {selectedComponent.id.slice(0, 6)}
                                </span>
                            </div>
                        </div>

                        {/* Layout Section */}
                        <div className="p-4 border-b border-neutral-800/50">
                            <h3 className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2 mb-3">
                                <Layout size={12} /> Layout
                            </h3>
                            <div className="grid grid-cols-2 gap-3">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-400 pl-0.5">X</label>
                                    <input
                                        type="number"
                                        value={selectedComponent.position.x}
                                        onChange={(e) => handlePosChange('x', parseInt(e.target.value))}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-400 pl-0.5">Y</label>
                                    <input
                                        type="number"
                                        value={selectedComponent.position.y}
                                        onChange={(e) => handlePosChange('y', parseInt(e.target.value))}
                                        className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-colors"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-400 pl-0.5">W</label>
                                    <input
                                        type="number"
                                        value={selectedComponent.size.width}
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-xs text-neutral-500 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-400 pl-0.5">H</label>
                                    <input
                                        type="number"
                                        value={selectedComponent.size.height}
                                        className="w-full bg-neutral-900 border border-neutral-800 rounded px-2 py-1.5 text-xs text-neutral-500 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Content Section */}
                        <div className="p-4 border-b border-neutral-800/50">
                            <h3 className="text-[10px] font-bold text-neutral-500 uppercase flex items-center gap-2 mb-3">
                                <Layers size={12} /> Component Settings
                            </h3>
                            <div className="space-y-3">
                                {/* BUTTON */}
                                {selectedComponent.type === 'button' && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-neutral-400 pl-0.5">Label</label>
                                            <input
                                                type="text"
                                                value={selectedComponent.properties.text || ''}
                                                onChange={(e) => handlePropChange('text', e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-neutral-400 pl-0.5">Variant</label>
                                            <div className="relative">
                                                <select
                                                    value={selectedComponent.properties.variant || 'primary'}
                                                    onChange={(e) => handlePropChange('variant', e.target.value)}
                                                    className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                                                >
                                                    <option value="primary">Primary</option>
                                                    <option value="secondary">Secondary</option>
                                                    <option value="outline">Outline</option>
                                                </select>
                                                <ChevronDown size={14} className="absolute right-2 top-2 text-neutral-500 pointer-events-none" />
                                            </div>
                                        </div>
                                    </>
                                )}

                                {/* INPUT */}
                                {selectedComponent.type === 'input' && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-neutral-400 pl-0.5">Label Text</label>
                                            <input
                                                type="text"
                                                value={selectedComponent.properties.label || ''}
                                                onChange={(e) => handlePropChange('label', e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-neutral-400 pl-0.5">Placeholder</label>
                                            <input
                                                type="text"
                                                value={selectedComponent.properties.placeholder || ''}
                                                onChange={(e) => handlePropChange('placeholder', e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* CARD */}
                                {selectedComponent.type === 'card' && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-neutral-400 pl-0.5">Title</label>
                                            <input
                                                type="text"
                                                value={selectedComponent.properties.title || ''}
                                                onChange={(e) => handlePropChange('title', e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </>
                                )}

                                {/* TEXT */}
                                {selectedComponent.type === 'text' && (
                                    <>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-neutral-400 pl-0.5">Content</label>
                                            <textarea
                                                value={selectedComponent.properties.text || ''}
                                                onChange={(e) => handlePropChange('text', e.target.value)}
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-sm text-white min-h-[80px] focus:border-blue-500 focus:outline-none transition-colors resize-none"
                                            />
                                        </div>
                                        <div className="space-y-1">
                                            <label className="text-[10px] text-neutral-400 pl-0.5">Font Size (px)</label>
                                            <input
                                                type="number"
                                                value={selectedComponent.properties.fontSize || 16}
                                                onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value))}
                                                className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-sm text-white focus:border-blue-500 focus:outline-none transition-colors"
                                            />
                                        </div>
                                    </>
                                )}
                            </div>
                        </div>

                    </div>
                )}

                {/* Screen Props (Always visible at bottom or when nothing selected? usually visible when screen is active but no component) 
                    Re-designed to always show if activeScreen exists but only if nothing else selected for clarity
                */}
                {!selectedComponent && activeScreen && (
                    <div className="border-t border-neutral-800 mt-2">
                        <div className="px-4 py-3 bg-neutral-800/20 border-b border-neutral-800">
                            <h3 className="text-xs font-bold text-neutral-400 flex items-center gap-2">
                                <AppWindow size={14} /> Screen Settings
                            </h3>
                        </div>
                        <div className="p-4 space-y-4">
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-400 pl-0.5">Name</label>
                                <input
                                    type="text"
                                    value={activeScreen.name}
                                    onChange={(e) => updateScreen(activeScreen.id, { name: e.target.value })}
                                    className="w-full bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-sm text-neutral-300 focus:outline-none focus:border-neutral-700 focus:text-white transition-colors"
                                />
                            </div>
                            <div className="space-y-1">
                                <label className="text-[10px] text-neutral-400 pl-0.5">Device Frame</label>
                                <div className="relative">
                                    <select
                                        value={activeScreen.devicePreset || 'iphone-14-pro'}
                                        onChange={(e) => updateScreen(activeScreen.id, { devicePreset: e.target.value as any })}
                                        className="w-full appearance-none bg-neutral-950 border border-neutral-800 rounded px-2 py-1.5 text-xs text-white focus:border-blue-500 focus:outline-none transition-colors cursor-pointer"
                                    >
                                        <option value="iphone-14-pro">iPhone 14 Pro</option>
                                        <option value="desktop-hd">Desktop (1280x720)</option>
                                        <option value="desktop-fhd">Desktop FHD (1920x1080)</option>
                                        <option value="iphone-se">iPhone SE</option>
                                        <option value="ipad-mini">iPad Mini</option>
                                        <option value="custom">Custom</option>
                                    </select>
                                    <ChevronDown size={14} className="absolute right-2 top-2 text-neutral-500 pointer-events-none" />
                                </div>
                            </div>
                            <button
                                onClick={() => useProjectStore.getState().addScreen(activeScreen.devicePreset)}
                                className="w-full flex items-center justify-center gap-2 py-2 mt-2 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-md text-xs font-medium transition-colors border border-neutral-700"
                            >
                                <Plus size={12} />
                                Add Another Screen
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Fixed Footer Actions */}
            {selectedComponent && activeScreen && (
                <div className="p-4 border-t border-neutral-800 bg-neutral-900/50 backdrop-blur-sm z-10">
                    <button
                        className="w-full flex items-center justify-center gap-2 py-2 bg-red-500/10 text-red-400 rounded-md border border-red-500/20 hover:bg-red-500/20 hover:border-red-500/30 transition-all text-xs font-medium active:scale-95"
                        onClick={() => {
                            removeComponent(activeScreen.id, selectedComponent.id);
                        }}
                    >
                        <Trash2 size={12} />
                        Delete Component
                    </button>
                </div>
            )}
        </aside>
    );
}
