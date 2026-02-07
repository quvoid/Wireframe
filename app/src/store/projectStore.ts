import { create } from 'zustand';
import type { Project, WireframeScreen, WireframeComponent } from '../types';
import { DEVICE_PRESETS } from '../constants/presets';
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
    project: Project;
    activeScreenId: string | null;
    selectedComponentIds: string[];
    activeTool: 'select' | 'rectangle' | 'prototype' | 'line';

    // Actions
    createProject: (name: string) => void;
    addScreen: (preset?: WireframeScreen['devicePreset']) => void;
    updateScreen: (screenId: string, updates: Partial<WireframeScreen>) => void;
    removeScreen: (screenId: string) => void;
    selectScreen: (id: string) => void;
    setTool: (tool: 'select' | 'rectangle' | 'prototype' | 'line') => void;

    addComponent: (screenId: string, component: Omit<WireframeComponent, 'id'>) => void;
    updateComponent: (screenId: string, componentId: string, updates: Partial<Omit<WireframeComponent, 'id'>>) => void;
    removeComponent: (screenId: string, componentId: string) => void;

    addInteraction: (screenId: string, componentId: string | null, targetScreenId: string) => void;
    removeInteraction: (screenId: string, componentId: string | null) => void;

    // Theme
    updateTheme: (theme: Partial<Project['theme']>) => void;

    // Alignment Actions
    alignComponents: (type: 'left' | 'center' | 'right' | 'top' | 'middle' | 'bottom' | 'distribute-h' | 'distribute-v') => void;

    selectComponent: (id: string, multi?: boolean) => void;
    deselectAll: () => void;

    // History
    past: Project[];
    future: Project[];
    undo: () => void;
    redo: () => void;
    canUndo: () => boolean;
    canRedo: () => boolean;
}

const initialProject: Project = {
    id: 'proj_default',
    name: 'Untitled Project',
    screens: [],
    metadata: {
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
    },
    theme: {
        primaryColor: '#2563eb', // blue-600
        borderRadius: '4px',
        fontFamily: 'Inter, sans-serif'
    }
};

export const useProjectStore = create<ProjectState>((set, get) => ({
    project: initialProject,
    activeScreenId: null,
    selectedComponentIds: [],
    activeTool: 'select',
    past: [],
    future: [],

    // ... existing undo/redo ...
    canUndo: () => get().past.length > 0,
    canRedo: () => get().future.length > 0,
    undo: () => set((state) => {
        if (state.past.length === 0) return {};
        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);
        return { project: previous, past: newPast, future: [state.project, ...state.future] };
    }),
    redo: () => set((state) => {
        if (state.future.length === 0) return {};
        const next = state.future[0];
        const newFuture = state.future.slice(1);
        return { project: next, past: [...state.past, state.project], future: newFuture };
    }),

    // ... existing actions ...

    alignComponents: (type) => set((state) => {
        if (state.selectedComponentIds.length < 2) return {};

        const activeScreen = state.project.screens.find(s => s.id === state.activeScreenId);
        if (!activeScreen) return {};

        const selectedComponents = activeScreen.components.filter(c => state.selectedComponentIds.includes(c.id));
        if (selectedComponents.length < 2) return {};

        // Calculate bounds
        let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
        selectedComponents.forEach(c => {
            minX = Math.min(minX, c.position.x);
            minY = Math.min(minY, c.position.y);
            maxX = Math.max(maxX, c.position.x + c.size.width);
            maxY = Math.max(maxY, c.position.y + c.size.height);
        });

        const centerX = minX + (maxX - minX) / 2;
        const centerY = minY + (maxY - minY) / 2;

        const updatedComponents = selectedComponents.map(c => {
            let newX = c.position.x;
            let newY = c.position.y;

            if (type === 'left') newX = minX;
            if (type === 'center') newX = centerX - c.size.width / 2;
            if (type === 'right') newX = maxX - c.size.width;
            if (type === 'top') newY = minY;
            if (type === 'middle') newY = centerY - c.size.height / 2;
            if (type === 'bottom') newY = maxY - c.size.height;

            return { ...c, position: { x: newX, y: newY } };
        });

        // Distribute logic needs sorted array
        if (type === 'distribute-h') {
            const sorted = [...selectedComponents].sort((a, b) => a.position.x - b.position.x);
            const totalWidth = sorted.reduce((sum, c) => sum + c.size.width, 0);
            const availableSpace = (maxX - minX) - totalWidth;
            const gap = availableSpace / (sorted.length - 1);

            let currentX = minX;
            sorted.forEach(c => {
                const match = updatedComponents.find(u => u.id === c.id);
                if (match) {
                    match.position.x = currentX;
                    currentX += c.size.width + gap;
                }
            });
        }

        if (type === 'distribute-v') {
            const sorted = [...selectedComponents].sort((a, b) => a.position.y - b.position.y);
            const totalHeight = sorted.reduce((sum, c) => sum + c.size.height, 0);
            const availableSpace = (maxY - minY) - totalHeight;
            const gap = availableSpace / (sorted.length - 1);

            let currentY = minY;
            sorted.forEach(c => {
                const match = updatedComponents.find(u => u.id === c.id);
                if (match) {
                    match.position.y = currentY;
                    currentY += c.size.height + gap;
                }
            });
        }

        // Apply updates
        const past = [...state.past, state.project];
        const newScreens = state.project.screens.map(s => {
            if (s.id !== state.activeScreenId) return s;
            return {
                ...s,
                components: s.components.map(c => {
                    const updated = updatedComponents.find(u => u.id === c.id);
                    return updated || c;
                })
            };
        });

        return {
            project: { ...state.project, screens: newScreens },
            past,
            future: []
        };
    }),

    createProject: (name) => set({
        project: { ...initialProject, id: uuidv4(), name },
        activeScreenId: null,
        past: [],
        future: []
    }),

    addScreen: (preset = 'iphone-14-pro') => set((state) => {
        const presetData = DEVICE_PRESETS[preset] || DEVICE_PRESETS['iphone-14-pro'];

        // Save history before change
        const past = [...state.past, state.project];
        const future: Project[] = []; // Clear future on new action

        // Calculate position: simpler approach, just put it to the right of the last screen + 100px
        const lastScreen = state.project.screens[state.project.screens.length - 1];
        const position = lastScreen
            ? { x: lastScreen.position.x + lastScreen.dimensions.width + 100, y: lastScreen.position.y }
            : { x: 100, y: 100 };

        const newScreen: WireframeScreen = {
            id: uuidv4(),
            name: `Screen ${state.project.screens.length + 1}`,
            devicePreset: preset,
            dimensions: presetData.dimensions,
            position,
            background: '#ffffff',
            components: []
        };

        return {
            project: {
                ...state.project,
                screens: [...state.project.screens, newScreen]
            },
            activeScreenId: newScreen.id,
            past,
            future
        };
    }),

    selectScreen: (id) => set({ activeScreenId: id }),
    setTool: (tool) => set({ activeTool: tool }),

    updateScreen: (screenId, updates) => set((state) => {
        // Save history before change
        const past = [...state.past, state.project];
        const future: Project[] = [];

        const updatedScreens = state.project.screens.map(screen => {
            if (screen.id !== screenId) return screen;

            // If preset is changing, update dimensions too
            if (updates.devicePreset && updates.devicePreset !== screen.devicePreset) {
                const presetData = DEVICE_PRESETS[updates.devicePreset] || DEVICE_PRESETS['iphone-14-pro'];
                return {
                    ...screen,
                    ...updates,
                    dimensions: presetData.dimensions
                };
            }

            return { ...screen, ...updates };
        });

        return {
            project: {
                ...state.project,
                screens: updatedScreens
            },
            past,
            future
        };
    }),

    removeScreen: (screenId) => set((state) => {
        const past = [...state.past, state.project];
        const future: Project[] = [];

        const updatedScreens = state.project.screens.filter(s => s.id !== screenId);

        return {
            project: {
                ...state.project,
                screens: updatedScreens
            },
            activeScreenId: state.activeScreenId === screenId ? null : state.activeScreenId,
            past,
            future
        };
    }),

    addComponent: (screenId, componentData) => set((state) => {
        const past = [...state.past, state.project];
        const future: Project[] = [];

        const newComponent: WireframeComponent = {
            ...componentData,
            id: uuidv4()
        };

        const updatedScreens = state.project.screens.map(screen => {
            if (screen.id !== screenId) return screen;
            return {
                ...screen,
                components: [...screen.components, newComponent]
            };
        });

        return {
            project: {
                ...state.project,
                screens: updatedScreens
            },
            past,
            future
        };
    }),

    updateComponent: (screenId, componentId, updates) => set((state) => {
        const past = [...state.past, state.project];
        const future: Project[] = [];

        const updatedScreens = state.project.screens.map(screen => {
            if (screen.id !== screenId) return screen;
            return {
                ...screen,
                components: screen.components.map(comp =>
                    comp.id === componentId ? { ...comp, ...updates } : comp
                )
            };
        });

        return {
            project: {
                ...state.project,
                screens: updatedScreens
            },
            past,
            future
        };
    }),

    removeComponent: (screenId, componentId) => set((state) => {
        const past = [...state.past, state.project];
        const future: Project[] = [];

        const updatedScreens = state.project.screens.map(screen => {
            if (screen.id !== screenId) return screen;
            return {
                ...screen,
                components: screen.components.filter(c => c.id !== componentId)
            };
        });

        return {
            project: {
                ...state.project,
                screens: updatedScreens
            },
            selectedComponentIds: state.selectedComponentIds.filter(id => id !== componentId),
            past,
            future
        };
    }),

    addInteraction: (screenId, componentId, targetScreenId) => set((state) => {
        const past = [...state.past, state.project];
        const future: Project[] = [];

        const updatedScreens = state.project.screens.map(screen => {
            if (screen.id !== screenId) return screen;

            // Screen Level Interaction
            if (!componentId) {
                return {
                    ...screen,
                    interaction: { action: 'navigate' as const, targetScreenId }
                };
            }

            // Component Level Interaction
            return {
                ...screen,
                components: screen.components.map(comp =>
                    comp.id === componentId
                        ? { ...comp, interaction: { action: 'navigate' as const, targetScreenId } }
                        : comp
                )
            };
        });
        return {
            project: { ...state.project, screens: updatedScreens },
            past,
            future
        };
    }),

    removeInteraction: (screenId: string, componentId: string | null) => set((state) => {
        const past = [...state.past, state.project];
        const future: Project[] = [];

        const updatedScreens = state.project.screens.map(screen => {
            if (screen.id !== screenId) return screen;

            // Screen Level
            if (!componentId) {
                const { interaction, ...rest } = screen;
                return rest;
            }

            // Component Level
            return {
                ...screen,
                components: screen.components.map(comp => {
                    if (comp.id !== componentId) return comp;
                    const { interaction, ...rest } = comp;
                    return rest;
                })
            };
        });
        return {
            project: { ...state.project, screens: updatedScreens },
            past,
            future
        };
    }),

    updateTheme: (themeUpdates) => set(state => ({
        project: {
            ...state.project,
            theme: { ...state.project.theme, ...themeUpdates }
        }
    })),

    selectComponent: (id, multi = false) => set((state) => ({
        selectedComponentIds: multi
            ? [...state.selectedComponentIds, id]
            : [id]
    })),

    deselectAll: () => set({ selectedComponentIds: [] }),
}));
