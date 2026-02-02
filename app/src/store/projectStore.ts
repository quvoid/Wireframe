import { create } from 'zustand';
import type { Project, WireframeScreen, WireframeComponent } from '../types';
import { v4 as uuidv4 } from 'uuid';

interface ProjectState {
    project: Project;
    activeScreenId: string | null;
    selectedComponentIds: string[];

    // Actions
    createProject: (name: string) => void;
    addScreen: (preset?: WireframeScreen['devicePreset']) => void;
    selectScreen: (id: string) => void;

    addComponent: (screenId: string, component: Omit<WireframeComponent, 'id'>) => void;
    updateComponent: (screenId: string, componentId: string, updates: Partial<Omit<WireframeComponent, 'id'>>) => void;

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

    createProject: (name) => set({
        project: { ...initialProject, id: uuidv4(), name },
        activeScreenId: null
    }),

    addScreen: (preset = 'iphone-14-pro') => set((state) => {
        const newScreen: WireframeScreen = {
            id: uuidv4(),
            name: `Screen ${state.project.screens.length + 1}`,
            devicePreset: preset,
            dimensions: { width: 393, height: 852 }, // Default iPhone 14 Pro
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

    selectComponent: (id, multi = false) => set((state) => ({
        selectedComponentIds: multi
            ? [...state.selectedComponentIds, id]
            : [id]
    })),

    deselectAll: () => set({ selectedComponentIds: [] }),
}));
