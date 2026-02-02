import { DraggableSidebarItem } from './DraggableSidebarItem';

const SIDEBAR_ITEMS = [
    { type: 'button', label: 'Button' },
    { type: 'input', label: 'Input Field' },
    { type: 'card', label: 'Card' },
    { type: 'text', label: 'Text Block' },
];

export function Sidebar() {
    return (
        <aside className="w-64 border-r border-neutral-800 bg-neutral-900 flex flex-col z-20">
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
