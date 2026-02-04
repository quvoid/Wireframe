import { useEffect, useRef, useState } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { ScreenContainer } from './ScreenContainer';
import { Minus, Plus, Layout } from 'lucide-react';


export function Canvas() {
    const screens = useProjectStore(state => state.project.screens);
    const activeScreenId = useProjectStore(state => state.activeScreenId);
    const selectedComponentIds = useProjectStore(state => state.selectedComponentIds);
    const removeComponent = useProjectStore(state => state.removeComponent);
    const addInteraction = useProjectStore(state => state.addInteraction);
    const activeTool = useProjectStore(state => state.activeTool);


    const [pan, setPan] = useState({ x: 0, y: 0 });
    const [zoom, setZoom] = useState(1);
    const [isPanning, setIsPanning] = useState(false);
    const [isSpacePressed, setIsSpacePressed] = useState(false);

    // Prototyping State
    const [interactionSource, setInteractionSource] = useState<{ screenId: string, componentId: string, startPos: { x: number, y: number } } | null>(null);
    const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

    // State to track middle mouse drag
    const lastMousePos = useRef({ x: 0, y: 0 });

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.code === 'Space' && !e.repeat && (e.target as HTMLElement).tagName !== 'INPUT' && (e.target as HTMLElement).tagName !== 'TEXTAREA') {
                setIsSpacePressed(true);
            }

            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentIds.length > 0 && activeScreenId) {
                const target = e.target as HTMLElement;
                if (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA') return;

                selectedComponentIds.forEach(id => {
                    removeComponent(activeScreenId, id);
                });
            }
        };

        const handleKeyUp = (e: KeyboardEvent) => {
            if (e.code === 'Space') {
                setIsSpacePressed(false);
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
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
        // Panning conditions:
        // 1. Middle Mouse (button 1)
        // 2. Alt + Click
        // 3. Spacebar Pressed + Left Click
        // 4. Background Click (Left Click) + Select Tool
        const isBackgroundClick = e.target === e.currentTarget;

        if (
            e.button === 1 ||
            (e.button === 0 && e.altKey) ||
            (e.button === 0 && isSpacePressed) ||
            (e.button === 0 && isBackgroundClick && activeTool === 'select')
        ) {
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
        const screen = screens.find(s => s.id === screenId);
        if (!screen) return;

        setInteractionSource({
            screenId,
            componentId,
            startPos: {
                x: screen.position.x + componentRect.x + componentRect.w,
                y: screen.position.y + componentRect.y + componentRect.h / 2
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
            className={`w-full h-full overflow-hidden bg-neutral-950 relative ${isPanning ? 'cursor-grabbing' : isSpacePressed ? 'cursor-grab' : 'cursor-default'
                }`}
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
            <div className="absolute bottom-6 right-6 flex items-center gap-1 bg-neutral-900/80 backdrop-blur-md p-1 rounded-xl border border-neutral-800/50 shadow-2xl">
                <button
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-all disabled:opacity-50 active:scale-95"
                    onClick={() => setZoom(z => Math.max(0.1, z - 0.1))}
                    title="Zoom Out"
                    disabled={zoom <= 0.1}
                >
                    <Minus size={16} />
                </button>
                <div
                    className="px-2 text-xs font-mono font-medium text-neutral-300 min-w-[4ch] text-center cursor-pointer hover:text-blue-400 transition-colors select-none"
                    onClick={() => setZoom(1)}
                    title="Reset to 100%"
                >
                    {Math.round(zoom * 100)}%
                </div>
                <button
                    className="p-2 hover:bg-white/10 rounded-lg text-neutral-400 hover:text-white transition-all disabled:opacity-50 active:scale-95"
                    onClick={() => setZoom(z => Math.min(5, z + 0.1))}
                    title="Zoom In"
                    disabled={zoom >= 5}
                >
                    <Plus size={16} />
                </button>
            </div>

            {screens.length === 0 && (
                <div className="absolute inset-0 flex flex-col items-center justify-center text-neutral-500 gap-4">
                    <div className="w-16 h-16 bg-neutral-900 rounded-2xl flex items-center justify-center border border-neutral-800 shadow-xl">
                        <Layout size={32} className="opacity-50" />
                    </div>
                    <div className="text-center">
                        <p className="font-medium text-neutral-400 mb-1">Canvas is empty</p>
                        <p className="text-sm opacity-60">Add a screen to start designing</p>
                    </div>
                </div>
            )}
        </div>
    );
}
