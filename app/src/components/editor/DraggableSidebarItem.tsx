import { useDraggable } from '@dnd-kit/core';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '../../utils/cn';

interface Props {
    type: string;
    label: string;
}

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
                "p-3 bg-neutral-800 rounded mb-2 cursor-grab hover:bg-neutral-700 transition active:cursor-grabbing border border-transparent hover:border-neutral-600 select-none",
            )}
        >
            {label}
        </div>
    );
}
