import { useEffect } from 'react';
import { useProjectStore } from '../../store/projectStore';
import { ScreenContainer } from './ScreenContainer';

export function Canvas() {
    const screens = useProjectStore(state => state.project.screens);
    const activeScreenId = useProjectStore(state => state.activeScreenId);
    const selectedComponentIds = useProjectStore(state => state.selectedComponentIds);
    const removeComponent = useProjectStore(state => state.removeComponent);

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedComponentIds.length > 0 && activeScreenId) {
                // Ignore if typing in an input
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

    return (
        <div className="w-full h-full overflow-auto bg-neutral-950 p-20 flex items-start justify-center gap-16 min-w-full min-h-full">
            {screens.length === 0 ? (
                <div className="text-neutral-500 mt-20">No screens. Add one to start.</div>
            ) : (
                screens.map(screen => (
                    <ScreenContainer
                        key={screen.id}
                        screen={screen}
                        isActive={screen.id === activeScreenId}
                    />
                ))
            )}
        </div>
    );
}
