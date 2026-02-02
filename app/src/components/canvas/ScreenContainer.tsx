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
                borderRadius: 40 // Mobile preset default
            }}
            onClick={(e) => {
                e.stopPropagation();
                selectScreen(screen.id);
            }}
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
        </div>
    );
}
