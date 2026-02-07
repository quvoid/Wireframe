import { useState, useEffect, useRef, ReactNode } from 'react';
import { PanelLeft, PanelRight, GripVertical } from 'lucide-react';
import { cn } from '../../utils/cn';

interface ResizablePanelProps {
    side: 'left' | 'right';
    defaultWidth?: number;
    minWidth?: number;
    maxWidth?: number;
    children: ReactNode;
    className?: string;
    onCollapse?: (collapsed: boolean) => void;
}

export function ResizablePanel({
    side,
    defaultWidth = 280,
    minWidth = 200,
    maxWidth = 600,
    children,
    className,
    onCollapse
}: ResizablePanelProps) {
    const [width, setWidth] = useState(defaultWidth);
    const [isResizing, setIsResizing] = useState(false);
    // Add collapse state management
    const [isCollapsed, setIsCollapsed] = useState(false);
    const sidebarRef = useRef<HTMLDivElement>(null);
    const isResizingRef = useRef(false);

    const startResizing = (mouseDownEvent: React.MouseEvent) => {
        mouseDownEvent.preventDefault();
        setIsResizing(true);
        isResizingRef.current = true;
    };

    const stopResizing = () => {
        setIsResizing(false);
        isResizingRef.current = false;
    };

    const resize = (mouseMoveEvent: MouseEvent) => {
        if (isResizingRef.current) {
            let newWidth;

            if (side === 'left') {
                const left = sidebarRef.current?.getBoundingClientRect().left || 0;
                newWidth = mouseMoveEvent.clientX - left;
            } else {
                // For right panel, width is window width - mouse X
                newWidth = window.innerWidth - mouseMoveEvent.clientX;
            }

            // Clamp values
            if (newWidth < minWidth) {
                // Maybe snap to collapse if very small?
                if (newWidth < 50) {
                    handleCollapse(true);
                    return;
                }
                newWidth = minWidth;
            } else if (newWidth > maxWidth) {
                newWidth = maxWidth;
            }

            if (!isCollapsed) {
                setWidth(newWidth);
            }
        }
    };

    useEffect(() => {
        const handleMouseMove = (e: MouseEvent) => resize(e);
        const handleMouseUp = () => stopResizing();

        window.addEventListener('mousemove', handleMouseMove);
        window.addEventListener('mouseup', handleMouseUp);
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
            window.removeEventListener('mouseup', handleMouseUp);
        };
    }, [side, minWidth, maxWidth]); // Dependencies for resize function context

    const handleCollapse = (collapsed: boolean) => {
        setIsCollapsed(collapsed);
        if (onCollapse) onCollapse(collapsed);
        if (!collapsed && width < minWidth) {
            setWidth(defaultWidth);
        }
    };

    // If collapsed, we show a small strip with a button to expand
    if (isCollapsed) {
        return (
            <div className={cn(
                "h-full bg-neutral-900 border-neutral-800 flex flex-col items-center py-4 z-20 relative transition-all duration-300",
                side === 'left' ? "border-r" : "border-l",
                "w-12" // Collapsed width
            )}>
                <button
                    onClick={() => handleCollapse(false)}
                    className="p-2 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-colors"
                    title="Expand"
                >
                    {side === 'left' ? <PanelLeft size={20} /> : <PanelRight size={20} />}
                </button>
            </div>
        );
    }

    return (
        <div
            ref={sidebarRef}
            className={cn(
                "relative flex flex-col h-full bg-neutral-900 z-20 group transition-[width] duration-0 ease-linear", // Disable transition during resize
                side === 'left' ? "border-r border-neutral-800" : "border-l border-neutral-800",
                className
            )}
            style={{ width: `${width}px` }}
        >
            {/* Toggle Button (Visible on Hover in header area usually, but here absolute top corner) */}
            <button
                onClick={() => handleCollapse(true)}
                className={cn(
                    "absolute top-3 p-1.5 rounded-md text-neutral-500 hover:text-white hover:bg-neutral-800 transition-opacity opacity-0 group-hover:opacity-100 z-30",
                    side === 'left' ? "right-2" : "left-2"
                )}
                title="Collapse"
            >
                {side === 'left' ? <PanelLeft size={14} /> : <PanelRight size={14} />}
            </button>

            {/* Drag Handle */}
            <div
                className={cn(
                    "absolute top-0 bottom-0 w-1 cursor-col-resize z-40 flex items-center justify-center transition-colors select-none",
                    side === 'left' ? "-right-1 hover:bg-blue-600/50" : "-left-1 hover:bg-blue-600/50", // Extend hit area
                    isResizing ? "bg-blue-600 w-0.5" : "bg-transparent"
                )}
                onMouseDown={startResizing}
            >
            </div>

            {/* Content Container */}
            <div className="flex-1 flex flex-col overflow-hidden w-full h-full">
                {children}
            </div>
        </div>
    );
}
