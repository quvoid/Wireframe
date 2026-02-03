import { DraggableSidebarItem } from './DraggableSidebarItem';
import { useProjectStore } from '../../store/projectStore';
import { MousePointer2, Square } from 'lucide-react';
import { cn } from '../../utils/cn';

const SIDEBAR_ITEMS = [
    { type: 'button', label: 'Button' },
    { type: 'input', label: 'Input Field' },
    { type: 'card', label: 'Card' },
    { type: 'text', label: 'Text Block' },
];

export function Sidebar() {
    const activeTool = useProjectStore(state => state.activeTool);
    const setTool = useProjectStore(state => state.setTool);

    return (
        <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col z-20">
            <div className="p-4 border-b border-neutral-800 space-y-3">
                <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Tools</h2>
                <div className="flex gap-2">
                    <button
                        onClick={() => setTool('select')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 p-2 rounded text-xs font-medium transition-colors",
                            activeTool === 'select'
                                ? "bg-blue-600 text-white"
                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                        )}
                    >
                        <MousePointer2 size={14} />
                        Select
                    </button>
                    <button
                        onClick={() => setTool('rectangle')}
                        className={cn(
                            "flex-1 flex items-center justify-center gap-2 p-2 rounded text-xs font-medium transition-colors",
                            activeTool === 'rectangle'
                                ? "bg-blue-600 text-white"
                                : "bg-neutral-800 text-neutral-400 hover:bg-neutral-700 hover:text-white"
                        )}
                    >
                        <Square size={14} />
                        Rect
                    </button>
                </div>
            </div>

            <div className="p-4 border-b border-neutral-800">
                <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Components</h2>
            </div>
            <div className="flex-1 p-2 overflow-y-auto">
                {SIDEBAR_ITEMS.map((item) => (
                    <DraggableSidebarItem key={item.type} type={item.type} label={item.label} />
                ))}
            </div>
        </aside>
    );
}
