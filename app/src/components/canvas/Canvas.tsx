import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { ScreenContainer } from './ScreenContainer';
import { Minus, Plus } from 'lucide-react';


export function Canvas() {
    const screens = useProjectStore(state => state.project.screens);
    const activeScreenId = useProjectStore(state => state.activeScreenId);
    const selectedComponentIds = useProjectStore(state => state.selectedComponentIds);
    const removeComponent = useProjectStore(state => state.removeComponent);
    const addInteraction = useProjectStore(state => state.addInteraction);


    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isPanning, setIsPanning] = useState(false);

    // Prototyping State
    const [interactionSource, setInteractionSource] = useState<{ screenId: string, componentId: string, startPos: { x: number, y: number } } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

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

        if (interactionSource) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = (e.clientX - rect.left - pan.x) / zoom;
            const y = (e.clientY - rect.top - pan.y) / zoom;
            setMousePos({ x, y });
        }
    };

    const onComponentInteractionStart = (screenId: string, componentId: string, componentRect: { x: number, y: number, w: number, h: number }) => {
        setInteractionSource({
            screenId,
            componentId,
            startPos: {
                x: componentRect.x + componentRect.w,
                y: componentRect.y + componentRect.h / 2
            }
        });
    };

    const onScreenInteractionDrop = (targetScreenId: string) => {
        if (interactionSource && interactionSource.screenId !== targetScreenId) {
            addInteraction(interactionSource.screenId, interactionSource.componentId, targetScreenId);
            setInteractionSource(null);
        }
    };

    const handleMouseUp = () => {
        setIsPanning(false);
        if (interactionSource) {
            setInteractionSource(null);
        }
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
                        onInteractionStart={onComponentInteractionStart}
                        onInteractionDrop={onScreenInteractionDrop}
                    />
                ))}

                {/* Interaction Layer (SVG) */}
                <svg className="absolute inset-0 pointer-events-none overflow-visible" style={{ zIndex: 100 }}>
                    {screens.flatMap(sourceScreen =>
                        sourceScreen.components
                            .filter(c => c.interaction?.action === 'navigate')
                            .map(c => {
                                const targetScreen = screens.find(s => s.id === c.interaction?.targetScreenId);
                                if (!targetScreen) return null;

                                // Calculate positions
                                // Source: Center of component (relative to canvas)
                                const startX = sourceScreen.position.x + c.position.x + (c.size.width / 2);
                                const startY = sourceScreen.position.y + c.position.y + (c.size.height / 2);

                                // Target: Top-Left of target screen (or left-center)
                                const endX = targetScreen.position.x;
                                const endY = targetScreen.position.y + (targetScreen.dimensions.height / 2);

                                // Bezier Curve
                                const controlPoint1 = { x: startX + 100, y: startY };
                                const controlPoint2 = { x: endX - 100, y: endY };

                                const path = `M ${startX} ${startY} C ${controlPoint1.x} ${controlPoint1.y}, ${controlPoint2.x} ${controlPoint2.y}, ${endX} ${endY}`;

                                return (
                                    <g key={`${c.id}-${targetScreen.id}`}>
                                        <path
                                            d={path}
                                            stroke="#3b82f6"
                                            strokeWidth="2"
                                            fill="none"
                                            strokeDasharray="4 4"
                                        />
                                        <circle cx={startX} cy={startY} r="4" fill="#3b82f6" />
                                        <polygon points={`${endX},${endY} ${endX - 10},${endY - 5} ${endX - 10},${endY + 5}`} fill="#3b82f6" />
                                    </g>
                                );
                            })
                    )}

                    {/* Ghost Line */}
                    {interactionSource && (
                        <path
                            d={`M ${interactionSource.startPos.x} ${interactionSource.startPos.y} L ${mousePos.x} ${mousePos.y}`}
                            stroke="#3b82f6"
                            strokeWidth="2"
                            fill="none"
                            strokeDasharray="4 4"
                            opacity="0.5"
                        />
                    )}
                </svg>
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
