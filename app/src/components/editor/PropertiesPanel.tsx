import { useProjectStore } from '../../store/projectStore';
import { MousePointer2, Type, Layout, Trash2 } from 'lucide-react';

export function PropertiesPanel() {
    const activeScreenId = useProjectStore(state => state.activeScreenId);
    const selectedComponentIds = useProjectStore(state => state.selectedComponentIds);
    const project = useProjectStore(state => state.project);
    const updateComponent = useProjectStore(state => state.updateComponent);

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
            <aside className="w-72 border-l border-neutral-800 bg-neutral-900 flex flex-col z-20">
                <div className="flex-1 flex items-center justify-center text-neutral-500 text-sm">
                    No Screen Selected
                </div>
            </aside>
        );
    }

    return (
        <aside className="w-72 border-l border-neutral-800 bg-neutral-900 flex flex-col z-20 shadow-xl">
            <div className="p-4 border-b border-neutral-800 bg-neutral-900">
                <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Properties</h2>
            </div>

            <div className="flex-1 p-4 overflow-y-auto">
                {!selectedComponent ? (
                    <div className="flex flex-col items-center justify-center h-48 text-neutral-500 text-sm gap-2">
                        <MousePointer2 size={24} className="opacity-20" />
                        <span>Select an element to edit</span>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {/* Header info */}
                        <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
                            <span className="font-semibold text-sm capitalize">{selectedComponent.type}</span>
                            <span className="text-xs text-neutral-500 font-mono">{selectedComponent.id.slice(0, 8)}</span>
                        </div>

                        {/* Position & Size */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                                <Layout size={12} /> Layout
                            </h3>
                            <div className="grid grid-cols-2 gap-2">
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-400">X</label>
                                    <input
                                        type="number"
                                        value={selectedComponent.position.x}
                                        onChange={(e) => handlePosChange('x', parseInt(e.target.value))}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-400">Y</label>
                                    <input
                                        type="number"
                                        value={selectedComponent.position.y}
                                        onChange={(e) => handlePosChange('y', parseInt(e.target.value))}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white"
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-400">W</label>
                                    <input
                                        type="number"
                                        value={selectedComponent.size.width}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white opacity-50 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                                <div className="space-y-1">
                                    <label className="text-[10px] text-neutral-400">H</label>
                                    <input
                                        type="number"
                                        value={selectedComponent.size.height}
                                        className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-xs text-white opacity-50 cursor-not-allowed"
                                        readOnly
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Specific Properties */}
                        <div className="space-y-3">
                            <h3 className="text-xs font-bold text-neutral-500 uppercase flex items-center gap-1">
                                <Type size={12} /> Content
                            </h3>

                            {/* BUTTON */}
                            {selectedComponent.type === 'button' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400">Text</label>
                                        <input
                                            type="text"
                                            value={selectedComponent.properties.text || ''}
                                            onChange={(e) => handlePropChange('text', e.target.value)}
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400">Variant</label>
                                        <select
                                            value={selectedComponent.properties.variant || 'primary'}
                                            onChange={(e) => handlePropChange('variant', e.target.value)}
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                                        >
                                            <option value="primary">Primary</option>
                                            <option value="secondary">Secondary</option>
                                            <option value="outline">Outline</option>
                                        </select>
                                    </div>
                                </>
                            )}

                            {/* INPUT */}
                            {selectedComponent.type === 'input' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400">Label</label>
                                        <input
                                            type="text"
                                            value={selectedComponent.properties.label || ''}
                                            onChange={(e) => handlePropChange('label', e.target.value)}
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400">Placeholder</label>
                                        <input
                                            type="text"
                                            value={selectedComponent.properties.placeholder || ''}
                                            onChange={(e) => handlePropChange('placeholder', e.target.value)}
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                                        />
                                    </div>
                                </>
                            )}

                            {/* CARD */}
                            {selectedComponent.type === 'card' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400">Title</label>
                                        <input
                                            type="text"
                                            value={selectedComponent.properties.title || ''}
                                            onChange={(e) => handlePropChange('title', e.target.value)}
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                                        />
                                    </div>
                                </>
                            )}

                            {/* TEXT */}
                            {selectedComponent.type === 'text' && (
                                <>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400">Text</label>
                                        <textarea
                                            value={selectedComponent.properties.text || ''}
                                            onChange={(e) => handlePropChange('text', e.target.value)}
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white min-h-[60px]"
                                        />
                                    </div>
                                    <div className="space-y-1">
                                        <label className="text-[10px] text-neutral-400">Font Size</label>
                                        <input
                                            type="number"
                                            value={selectedComponent.properties.fontSize || 16}
                                            onChange={(e) => handlePropChange('fontSize', parseInt(e.target.value))}
                                            className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                                        />
                                    </div>
                                </>
                            )}
                        </div>

                        <div className="pt-4 mt-4 border-t border-neutral-800">
                            <button className="w-full flex items-center justify-center gap-2 py-2 bg-red-900/20 text-red-500 rounded border border-red-900/50 hover:bg-red-900/40 text-xs font-medium">
                                <Trash2 size={12} />
                                Delete Component
                            </button>
                        </div>
                    </div>
                )}

                {/* Screen Props if nothing selected */}
                {!selectedComponent && activeScreen && (
                    <div className="mt-8 pt-8 border-t border-neutral-800 space-y-4">
                        <div className="flex items-center justify-between pb-2">
                            <span className="font-semibold text-sm">Screen Properties</span>
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400">Name</label>
                            <input
                                type="text"
                                value={activeScreen.name}
                                readOnly
                                className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-white"
                            />
                        </div>
                        <div className="space-y-1">
                            <label className="text-[10px] text-neutral-400">Preset</label>
                            <select disabled className="w-full bg-neutral-800 border border-neutral-700 rounded px-2 py-1 text-sm text-neutral-500">
                                <option>{activeScreen.devicePreset}</option>
                            </select>
                        </div>
                    </div>
                )}
            </div>
        </aside>
    );
}
