import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../utils/cn';
import { MousePointerClick, Type, CreditCard, Minus, Box, Image, UserCircle, ToggleRight, CheckSquare, StickyNote } from 'lucide-react';

interface Props {
    type: string;
    label: string;
}

const ICONS: Record<string, React.ReactNode> = {
    button: <MousePointerClick size={16} />,
    input: <Box size={16} />,
    card: <CreditCard size={16} />,
    text: <Type size={16} />,
    image: <Image size={16} />,
    avatar: <UserCircle size={16} />,
    toggle: <ToggleRight size={16} />,
    checkbox: <CheckSquare size={16} />,
    'sticky-note': <StickyNote size={16} />,
    line: <Minus size={16} />,
};

export function DraggableSidebarItem({ type, label }: Props) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({
        id: `sidebar-${type}`,
        data: {
            type,
            isSidebarItem: true,
        },
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    return (
        <div
            ref={setNodeRef}
            style={style}
            {...listeners}
            {...attributes}
            className={cn(
                "flex flex-col items-center justify-center gap-2 p-3 bg-neutral-800/50 rounded-lg cursor-grab hover:bg-neutral-800 transition-all duration-200 active:cursor-grabbing border border-neutral-800 hover:border-neutral-700 select-none group aspect-square",
            )}
        >
            <div className="text-neutral-400 group-hover:text-blue-400 transition-colors">
                {ICONS[type] || <Box size={16} />}
            </div>
            <span className="text-[10px] font-medium text-neutral-400 group-hover:text-neutral-200 text-center leading-tight">
                {label}
            </span>
        </div>
    );
}
