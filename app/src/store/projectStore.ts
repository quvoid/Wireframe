import { create } from 'zustand';
import type { Project, WireframeScreen, WireframeComponent } from '../types';
import { DEVICE_PRESETS } from '../constants/presets';
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
    project: Project;
    activeScreenId: string | null;
    selectedComponentIds: string[];
    activeTool: 'select' | 'rectangle';

    // Actions
    createProject: (name: string) => void;
    addScreen: (preset?: WireframeScreen['devicePreset']) => void;
    updateScreen: (screenId: string, updates: Partial<WireframeScreen>) => void;
    selectScreen: (id: string) => void;
    setTool: (tool: 'select' | 'rectangle') => void;

    addComponent: (screenId: string, component: Omit<WireframeComponent, 'id'>) => void;
    updateComponent: (screenId: string, componentId: string, updates: Partial<Omit<WireframeComponent, 'id'>>) => void;
    removeComponent: (screenId: string, componentId: string) => void;

    selectComponent: (id: string, multi?: boolean) => void;
    deselectAll: () => void;
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

export const useProjectStore = create<ProjectState>((set) => ({
    project: initialProject,
    activeScreenId: null,
    selectedComponentIds: [],
    activeTool: 'select',

    createProject: (name) => set({
        project: { ...initialProject, id: uuidv4(), name },
        activeScreenId: null
    }),

    addScreen: (preset = 'iphone-14-pro') => set((state) => {
        const presetData = DEVICE_PRESETS[preset] || DEVICE_PRESETS['iphone-14-pro'];
        const newScreen: WireframeScreen = {
            id: uuidv4(),
            name: `Screen ${state.project.screens.length + 1}`,
            devicePreset: preset,
            dimensions: presetData.dimensions,
            background: '#ffffff',
            components: []
        };

        return {
            project: {
                ...state.project,
                screens: [...state.project.screens, newScreen]
            },
            activeScreenId: newScreen.id
        };
    }),

    selectScreen: (id) => set({ activeScreenId: id }),
    setTool: (tool) => set({ activeTool: tool }),

    updateScreen: (screenId, updates) => set((state) => {
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
            }
        };
    }),

    addComponent: (screenId, componentData) => set((state) => {
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
            }
        };
    }),

    updateComponent: (screenId, componentId, updates) => set((state) => {
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
            }
        };
    }),

    removeComponent: (screenId, componentId) => set((state) => {
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
            selectedComponentIds: state.selectedComponentIds.filter(id => id !== componentId)
        };
    }),

    selectComponent: (id, multi = false) => set((state) => ({
        selectedComponentIds: multi
            ? [...state.selectedComponentIds, id]
            : [id]
    })),

    deselectAll: () => set({ selectedComponentIds: [] }),
}));
