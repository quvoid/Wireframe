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
    selectScreen: (id: string) => void;
    setTool: (tool: 'select' | 'rectangle' | 'prototype' | 'line') => void;

    addComponent: (screenId: string, component: Omit<WireframeComponent, 'id'>) => void;
    updateComponent: (screenId: string, componentId: string, updates: Partial<Omit<WireframeComponent, 'id'>>) => void;
    removeComponent: (screenId: string, componentId: string) => void;

    addInteraction: (screenId: string, componentId: string, targetScreenId: string) => void;
    removeInteraction: (screenId: string, componentId: string) => void;

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
};

export const useProjectStore = create<ProjectState>((set, get) => ({
    project: initialProject,
    activeScreenId: null,
    selectedComponentIds: [],
    activeTool: 'select',
    past: [],
    future: [],

    canUndo: () => get().past.length > 0,

    canRedo: () => get().future.length > 0,

    undo: () => set((state) => {
        if (state.past.length === 0) return {};

        const previous = state.past[state.past.length - 1];
        const newPast = state.past.slice(0, -1);

        return {
            project: previous,
            past: newPast,
            future: [state.project, ...state.future]
        };
    }),

    redo: () => set((state) => {
        if (state.future.length === 0) return {};

        const next = state.future[0];
        const newFuture = state.future.slice(1);

        return {
            project: next,
            past: [...state.past, state.project],
            future: newFuture
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

    removeInteraction: (screenId, componentId) => set((state) => {
        const past = [...state.past, state.project];
        const future: Project[] = [];

        const updatedScreens = state.project.screens.map(screen => {
            if (screen.id !== screenId) return screen;
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

    selectComponent: (id, multi = false) => set((state) => ({
        selectedComponentIds: multi
            ? [...state.selectedComponentIds, id]
            : [id]
    })),

    deselectAll: () => set({ selectedComponentIds: [] }),
}));
