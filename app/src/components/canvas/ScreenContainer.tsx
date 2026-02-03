import { useState } from 'react';
import type { WireframeScreen } from '../../types';
import { WireframeComponentRenderer } from '../wireframe/WireframeComponentRenderer';
import { cn } from '../../utils/cn';
import { useProjectStore } from '../../store/projectStore';
import { useDroppable } from '@dnd-kit/core';

interface Props {
    screen: WireframeScreen;
    isActive: boolean;
}

export function ScreenContainer({ screen, isActive }: Props) {
    const selectScreen = useProjectStore(state => state.selectScreen);
    const selectComponent = useProjectStore(state => state.selectComponent);
    const selectedComponentIds = useProjectStore(state => state.selectedComponentIds);
    const activeTool = useProjectStore(state => state.activeTool);
    const setTool = useProjectStore(state => state.setTool);
    const addComponent = useProjectStore(state => state.addComponent);

    const [isDrawing, setIsDrawing] = useState(false);
    const [startPos, setStartPos] = useState({ x: 0, y: 0 });
    const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 });

    const handleMouseDown = (e: React.MouseEvent) => {
        if (activeTool === 'rectangle') {
            e.stopPropagation();
            const rect = e.currentTarget.getBoundingClientRect();
            // Calculate position relative to the screen scale if any? 
            // The screen container uses scale transform. 
            // However, e.clientX is viewport. getBoundingClientRect typically accounts for transforms.
            // But we need coordinate inside the element.
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            setStartPos({ x, y });
            setCurrentPos({ x, y });
            setIsDrawing(true);
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
        }
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
            ref={setNodeRef}
            id={screen.id} // Important for geometry calculation
            className={cn(
                "relative bg-white shadow-2xl transition-all duration-300 overflow-hidden",
                isActive ? "ring-4 ring-blue-500/50 scale-100 z-10" : "opacity-80 scale-95 hover:opacity-100 hover:scale-[0.98]",
                isOver && "ring-4 ring-green-500/50"
            )}
            style={{
                width: screen.dimensions.width,
                height: screen.dimensions.height,
                borderRadius: screen.dimensions.width > 1000 ? 0 : 40, // Simple heuristic for rounded corners
                cursor: activeTool === 'rectangle' ? 'crosshair' : 'default'
            }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
        // Remove onClick as we handle selection in onMouseDown now
        >
            {/* Status Bar Placeholder */}
            <div className="absolute top-0 left-0 right-0 h-10 z-10 bg-black/5 flex items-center justify-center pointer-events-none">
                <span className="text-[10px] font-medium text-black/40">Status Bar</span>
            </div>

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
                            onClick={(e) => {
                                e.stopPropagation();
                                selectComponent(comp.id);
                            }}
                        >
                            <WireframeComponentRenderer component={comp} />
                        </div>
                    );
                })}
            </div>

            {/* Screen Label (Outside) */}
            <div className="absolute -top-8 left-0 text-sm font-medium text-neutral-500 whitespace-nowrap">
                {screen.name}
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
    );
}
