import type { DevicePresetKey } from './constants/presets';

export type DevicePreset = DevicePresetKey;

export interface BoxSize {
    width: number;
    height: number;
}

export interface Position {
    x: number;
    y: number;
}

export interface WireframeComponent {
    id: string;
    type: string; // 'button' | 'text' | 'input' | 'card' etc.
    name: string;
    position: Position;
    size: BoxSize;
    properties: Record<string, any>;
    style?: Record<string, any>;
    parentId?: string;
    children?: string[]; // IDs of children
}

export interface WireframeScreen {
    id: string;
    name: string;
    devicePreset: DevicePreset;
    dimensions: BoxSize;
    background: string;
    components: WireframeComponent[];
}

export interface Project {
    id: string;
    name: string;
    screens: WireframeScreen[];
    metadata: {
        createdAt: string;
        updatedAt: string;
    };
}
