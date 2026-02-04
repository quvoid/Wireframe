import { DraggableSidebarItem } from './DraggableSidebarItem';
import { useProjectStore } from '../../store/projectStore';
import { MousePointer2, Square, Plug } from 'lucide-react';
import { cn } from '../../utils/cn';

const SIDEBAR_ITEMS = [
    { type: 'button', label: 'Button' },
    { type: 'input', label: 'Input' },
    { type: 'card', label: 'Card' },
    { type: 'text', label: 'Text' },
    { type: 'image', label: 'Image' },
    { type: 'avatar', label: 'Avatar' },
    { type: 'toggle', label: 'Switch' },
    { type: 'checkbox', label: 'Checkbox' },
    { type: 'line', label: 'Divider' },
];

export function Sidebar() {
    const activeTool = useProjectStore(state => state.activeTool);
    const setTool = useProjectStore(state => state.setTool);

    return (
        <aside className="w-64 border-r border-neutral-800 bg-neutral-900/95 backdrop-blur-sm flex flex-col z-20">
            {/* Tools Section */}
            <div className="p-4 border-b border-neutral-800 space-y-3">
                <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest px-1">Tools</h2>
                <div className="flex gap-1 bg-neutral-950/50 p-1 rounded-lg border border-neutral-800/50">
                    <button
                        onClick={() => setTool('select')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200",
                            activeTool === 'select'
                                ? "bg-neutral-800 text-white shadow-sm ring-1 ring-white/10"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
                        )}
                        title="Select Tool (V)"
                    >
                        <MousePointer2 size={14} />
                    </button>
                    <button
                        onClick={() => setTool('rectangle')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200",
                            activeTool === 'rectangle'
                                ? "bg-neutral-800 text-white shadow-sm ring-1 ring-white/10"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
                        )}
                        title="Rectangle Tool (R)"
                    >
                        <Square size={14} />
                    </button>
                    <button
                        onClick={() => setTool('prototype')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 py-1.5 px-2 rounded-md text-xs font-medium transition-all duration-200",
                            activeTool === 'prototype'
                                ? "bg-blue-600/20 text-blue-400 ring-1 ring-blue-500/50"
                                : "text-neutral-500 hover:text-neutral-300 hover:bg-neutral-800/50"
                        )}
                        title="Prototype Mode (P)"
                    >
                        <Plug size={14} />
                    </button>
                </div>
            </div>

            {/* Components Section */}
            <div className="flex-1 overflow-y-auto">
                <div className="p-4">
                    <h2 className="text-[10px] font-bold text-neutral-500 uppercase tracking-widest mb-3 px-1">Components</h2>
                    <div className="grid grid-cols-2 gap-2">
                        {SIDEBAR_ITEMS.map((item) => (
                            <DraggableSidebarItem key={item.type} type={item.type} label={item.label} />
                        ))}
                    </div>
                </div>
            </div>

            {/* Footer / Version */}
            <div className="p-4 border-t border-neutral-800 text-[10px] text-neutral-600 text-center">
                Wireframe v0.1.0
            </div>
        </aside>
    );
}
