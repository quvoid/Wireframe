import { useState } from 'react';
import type { WireframeScreen } from '../../types';
import { WireframeComponentRenderer } from '../wireframe/WireframeComponentRenderer';
import { cn } from '../../utils/cn';
import { useProjectStore } from '../../store/projectStore';
import { useDroppable } from '@dnd-kit/core';
import { Trash2 } from 'lucide-react';

interface Props {
    screen: WireframeScreen;
    isActive: boolean;
    onInteractionStart?: (screenId: string, componentId: string | null, rect: { x: number, y: number, w: number, h: number }) => void;
    onInteractionDrop?: (screenId: string) => void;
    onScreenDragStart?: (id: string, e: React.MouseEvent) => void;
}

export function ScreenContainer({ screen, isActive, ...props }: Props) {
    const selectScreen = useProjectStore(state => state.selectScreen);
    const selectComponent = useProjectStore(state => state.selectComponent);
    const selectedComponentIds = useProjectStore(state => state.selectedComponentIds);
    const activeTool = useProjectStore(state => state.activeTool);
    const setTool = useProjectStore(state => state.setTool);
    const addComponent = useProjectStore(state => state.addComponent);
    const updateComponent = useProjectStore(state => state.updateComponent);
    const removeScreen = useProjectStore(state => state.removeScreen);

    const [isConfirmingDelete, setIsConfirmingDelete] = useState(false);
    const [isDrawing, setIsDrawing] = useState(false);
    const [dragState, setDragState] = useState<{
        type: 'move' | 'resize';
        componentId: string;
        startMouse: { x: number; y: number };
        initialPos: { x: number; y: number; w: number; h: number };
        handle?: string;
    } | null>(null);

    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (activeTool === 'rectangle') {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setStartPos({ x, y });
            setCurrentPos({ x, y });
            setIsDrawing(true);
        } else if (activeTool === 'prototype') {
            e.stopPropagation();
        } else {
            e.stopPropagation();
            selectScreen(screen.id);
        }
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (isDrawing) {
            const rect = e.currentTarget.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setCurrentPos({ x, y });
        } else if (dragState) {
            const dx = e.clientX - dragState.startMouse.x;
            const dy = e.clientY - dragState.startMouse.y;

            if (dragState.type === 'move') {
                updateComponent(screen.id, dragState.componentId, {
                    position: {
                        x: dragState.initialPos.x + dx,
                        y: dragState.initialPos.y + dy
                    }
                });
            } else if (dragState.type === 'resize' && dragState.handle) {
                const { x, y, w, h } = dragState.initialPos;
                let newX = x;
                let newY = y;
                let newW = w;
                let newH = h;

                if (dragState.handle.includes('e')) newW = Math.max(10, w + dx);
                if (dragState.handle.includes('s')) newH = Math.max(10, h + dy);
                if (dragState.handle.includes('w')) {
                    const deltaX = Math.min(dx, w - 10);
                    newX = x + deltaX;
                    newW = w - deltaX;
                }
                if (dragState.handle.includes('n')) {
                    const deltaY = Math.min(dy, h - 10);
                    newY = y + deltaY;
                    newH = h - deltaY;
                }

                updateComponent(screen.id, dragState.componentId, {
                    position: { x: newX, y: newY },
                    size: { width: newW, height: newH }
                });
            }
        }
    };

    const handleMouseUp = () => {
        if (isDrawing) {
            setIsDrawing(false);

            const width = Math.abs(currentPos.x - startPos.x);
            const height = Math.abs(currentPos.y - startPos.y);
            const x = Math.min(currentPos.x, startPos.x);
            const y = Math.min(currentPos.y, startPos.y);

            if (width > 10 && height > 10) {
                addComponent(screen.id, {
                    type: 'rectangle',
                    name: 'Rectangle',
                    position: { x, y },
                    size: { width, height },
                    properties: { background: '#e5e5e5' }
                });
                setTool('select');
            }
        } else if (dragState) {
            setDragState(null);
        }

        if (activeTool === 'prototype' && props.onInteractionDrop) {
            props.onInteractionDrop(screen.id);
        }
    };

    const handleCompMouseDown = (e: React.MouseEvent, comp: any, handle?: string) => {
        if (activeTool === 'prototype') {
            e.stopPropagation();
            e.preventDefault();
            if (props.onInteractionStart) {
                const rect = {
                    x: comp.position.x,
                    y: comp.position.y,
                    w: comp.size.width,
                    h: comp.size.height
                };
                props.onInteractionStart(screen.id, comp.id, rect);
            }
            return;
        }

        if (activeTool !== 'select') return;
        e.stopPropagation();

        selectComponent(comp.id);

        setDragState({
            type: handle ? 'resize' : 'move',
            componentId: comp.id,
            startMouse: { x: e.clientX, y: e.clientY },
            initialPos: {
                x: comp.position.x,
                y: comp.position.y,
                w: comp.size.width,
                h: comp.size.height
            },
            handle
        });
    };

    const { setNodeRef, isOver } = useDroppable({
        id: screen.id,
        data: {
            isScreen: true,
            screenId: screen.id
        }
    });

    return (
        <div
            className={cn(
                "absolute",
                isActive ? "z-10" : "z-0"
            )}
            style={{
                left: screen.position.x,
                top: screen.position.y,
                width: screen.dimensions.width,
                height: screen.dimensions.height,
            }}
        >
            {/* Screen Label & Controls */}
            <div
                className="absolute -top-8 left-0 flex items-center gap-2 py-1"
            >
                <div
                    className="text-sm font-medium text-neutral-500 whitespace-nowrap cursor-grab active:cursor-grabbing hover:text-neutral-300 transition-colors select-none"
                    onMouseDown={(e) => props.onScreenDragStart?.(screen.id, e)}
                >
                    {screen.name}
                </div>

                {/* Delete Button */}
                <div className="relative">
                    <button
                        className="p-1 text-neutral-600 hover:text-red-500 hover:bg-red-500/10 rounded transition-colors"
                        onClick={() => setIsConfirmingDelete(true)}
                        title="Delete Screen"
                    >
                        <Trash2 size={14} />
                    </button>

                    {/* Confirmation Popup */}
                    {isConfirmingDelete && (
                        <div className="absolute top-8 left-0 bg-neutral-900 border border-neutral-800 rounded-lg shadow-xl p-3 z-50 w-48 flex flex-col gap-2">
                            <p className="text-xs text-neutral-300">Delete this screen?</p>
                            <div className="flex items-center gap-2">
                                <button
                                    className="flex-1 px-2 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-400 text-xs rounded transition-colors"
                                    onClick={() => setIsConfirmingDelete(false)}
                                >
                                    Cancel
                                </button>
                                <button
                                    className="flex-1 px-2 py-1 bg-red-600 hover:bg-red-500 text-white text-xs rounded transition-colors"
                                    onClick={() => removeScreen(screen.id)}
                                >
                                    Delete
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            </div>

            {/* Device Frame (Droppable + Visuals + Clipping) */}
            <div
                ref={setNodeRef}
                id={screen.id}
                className={cn(
                    "w-full h-full bg-white shadow-2xl overflow-hidden relative",
                    isActive ? "ring-4 ring-blue-500/50" : "opacity-90 hover:opacity-100",
                    isOver && "ring-4 ring-green-500/50"
                )}
                style={{
                    borderRadius: screen.dimensions.width > 1000 ? 0 : 40,
                    cursor: activeTool === 'rectangle' ? 'crosshair' : 'default'
                }}
                onMouseDown={handleMouseDown}
                onMouseMove={handleMouseMove}
                onMouseUp={handleMouseUp}
                onMouseLeave={handleMouseUp}
            >
                {/* Status Bar Placeholder */}
                <div className="absolute top-0 left-0 right-0 h-10 z-10 bg-black/5 flex items-center justify-center pointer-events-none">
                    <span className="text-[10px] font-medium text-black/40">Status Bar</span>
                </div>

                {/* Screen Prototype Handle */}
                {activeTool === 'prototype' && (
                    <div
                        className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 border-4 border-white cursor-crosshair z-50 hover:scale-110 transition-transform shadow-md flex items-center justify-center"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            props.onInteractionStart?.(screen.id, null, {
                                x: screen.dimensions.width,
                                y: screen.dimensions.height / 2, // Centered vertically relative to screen
                                w: 0,
                                h: 0
                            });
                        }}
                    >
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                )}

                {/* Screen Prototype Handle */}
                {activeTool === 'prototype' && (
                    <div
                        className="absolute top-1/2 -right-3 -translate-y-1/2 w-6 h-6 rounded-full bg-blue-500 border-4 border-white cursor-crosshair z-50 hover:scale-110 transition-transform shadow-md flex items-center justify-center"
                        onMouseDown={(e) => {
                            e.stopPropagation();
                            props.onInteractionStart?.(screen.id, null, {
                                x: screen.dimensions.width,
                                y: screen.dimensions.height / 2, // Centered vertically relative to screen
                                w: 0,
                                h: 0
                            });
                        }}
                    >
                        <div className="w-1.5 h-1.5 bg-white rounded-full" />
                    </div>
                )}

                {/* Screen Content */}
                <div className="absolute inset-0 pt-10">
                    {screen.components.map((comp) => {
                        const isSelected = selectedComponentIds.includes(comp.id);
                        return (
                            <div
                                key={comp.id}
                                className={cn(
                                    "absolute transition-shadow",
                                    isSelected && "ring-2 ring-blue-500"
                                )}
                                style={{
                                    left: comp.position.x,
                                    top: comp.position.y,
                                    width: comp.size.width,
                                    height: comp.size.height,
                                    zIndex: 1
                                }}
                                onMouseDown={(e) => handleCompMouseDown(e, comp)}
                            >
                                <WireframeComponentRenderer component={comp} />

                                {/* Prototype Handle */}
                                {activeTool === 'prototype' && (
                                    <div className="absolute top-1/2 -right-3 -translate-y-1/2 w-4 h-4 rounded-full bg-blue-500 border-2 border-white cursor-crosshair z-20 hover:scale-125 transition-transform shadow-sm" />
                                )}

                                {/* Resize Handles */}
                                {isSelected && (
                                    <>
                                        <div className="absolute -inset-0.5 border-2 border-blue-500 pointer-events-none" />
                                        {/* Handles */}
                                        {['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'].map(h => (
                                            <div
                                                key={h}
                                                className={cn(
                                                    "absolute w-2.5 h-2.5 bg-white border border-blue-500 z-10",
                                                    h === 'nw' && "-top-1.5 -left-1.5 cursor-nw-resize",
                                                    h === 'n' && "-top-1.5 left-1/2 -translate-x-1/2 cursor-n-resize",
                                                    h === 'ne' && "-top-1.5 -right-1.5 cursor-ne-resize",
                                                    h === 'e' && "top-1/2 -right-1.5 -translate-y-1/2 cursor-e-resize",
                                                    h === 'se' && "-bottom-1.5 -right-1.5 cursor-se-resize",
                                                    h === 's' && "-bottom-1.5 left-1/2 -translate-x-1/2 cursor-s-resize",
                                                    h === 'sw' && "-bottom-1.5 -left-1.5 cursor-sw-resize",
                                                    h === 'w' && "top-1/2 -left-1.5 -translate-y-1/2 cursor-w-resize",
                                                )}
                                                onMouseDown={(e) => handleCompMouseDown(e, comp, h)}
                                            />
                                        ))}
                                    </>
                                )}
                            </div>
                        );
                    })}
                </div>

                {/* Drawing Preview */}
                {isDrawing && (
                    <div
                        className="absolute border-2 border-blue-500 bg-blue-500/10 z-50 pointer-events-none"
                        style={{
                            left: Math.min(startPos.x, currentPos.x),
                            top: Math.min(startPos.y, currentPos.y),
                            width: Math.abs(currentPos.x - startPos.x),
                            height: Math.abs(currentPos.y - startPos.y),
                        }}
                    />
                )}
            </div>
        </div>
    );
}
