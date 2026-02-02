import { useProjectStore } from '../../store/projectStore';
import { ScreenContainer } from './ScreenContainer';

export function Canvas() {
    const screens = useProjectStore(state => state.project.screens);
    const activeScreenId = useProjectStore(state => state.activeScreenId);

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
