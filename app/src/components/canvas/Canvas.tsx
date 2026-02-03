import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { ScreenContainer } from './ScreenContainer';
import { Minus, Plus } from 'lucide-react';


export function Canvas() {
    const screens = useProjectStore(state => state.project.screens);
    const activeScreenId = useProjectStore(state => state.activeScreenId);
    const selectedComponentIds = useProjectStore(state => state.selectedComponentIds);
    const removeComponent = useProjectStore(state => state.removeComponent);

    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isPanning, setIsPanning] = useState(false);

    // State to track middle mouse drag
    const lastMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentIds.length > 0 && activeScreenId) {
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

                selectedComponentIds.forEach(id => {
                    removeComponent(activeScreenId, id);
                });
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, [selectedComponentIds, activeScreenId, removeComponent]);

    const handleWheel = (e: React.WheelEvent) => {
        if (e.ctrlKey || e.metaKey) {
            // Zoom
            e.preventDefault();
            const scaleAmount = -e.deltaY * 0.001;
            setZoom(z => Math.min(Math.max(0.1, z + scaleAmount), 5));
        } else {
            // Pan
            setPan(p => ({
                x: p.x - e.deltaX,
                y: p.y - e.deltaY
            }));
        }
    };

    const handleMouseDown = (e: React.MouseEvent) => {
        // Middle mouse button
        if (e.button === 1 || (e.button === 0 && e.altKey)) {
            e.preventDefault();
            setIsPanning(true);
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isPanning) {
            const dx = e.clientX - lastMousePos.current.x;
            const dy = e.clientY - lastMousePos.current.y;

            setPan(p => ({ x: p.x + dx, y: p.y + dy }));
            lastMousePos.current = { x: e.clientX, y: e.clientY };
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
    };

    return (
        <div
            className="w-full h-full overflow-hidden bg-neutral-950 relative cursor-default"
            onWheel={handleWheel}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        >
            <div
                className="absolute top-0 left-0 transition-transform duration-75 ease-out origin-top-left will-change-transform"
                style={{
                    transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`
                }}
            >
                {screens.map(screen => (
                    <ScreenContainer
                        key={screen.id}
                        screen={screen}
                        isActive={screen.id === activeScreenId}
                    />
                ))}
            </div>

            {/* Controls Overlay */}
            <div className="absolute bottom-4 right-4 flex items-center gap-2 bg-neutral-800 p-1.5 rounded-lg border border-neutral-700 shadow-lg">
                <button
                    className="p-1.5 hover:bg-neutral-700 rounded text-neutral-300 hover:text-white transition-colors"
                    onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}
                    title="Zoom Out"
                >
                    <Minus size={16} />
                </button>
                <div
                    className="px-2 text-xs font-mono text-neutral-300 min-w-[3ch] text-center cursor-pointer hover:text-white"
                    onClick={() => setZoom(1)}
                    title="Reset to 100%"
                >
                    {Math.round(zoom * 100)}%
                </div>
                <button
                    className="p-1.5 hover:bg-neutral-700 rounded text-neutral-300 hover:text-white transition-colors"
                    onClick={() => setZoom(z => Math.min(5, z + 0.1))}
                    title="Zoom In"
                >
                    <Plus size={16} />
                </button>
            </div>

            {screens.length === 0 && (
                <div className="absolute inset-0 flex items-center justify-center text-neutral-500 pointer-events-none">
                    No screens. Add one to start.
                </div>
            )}
        </div>
    );
}
