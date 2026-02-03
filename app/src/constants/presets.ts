import type { BoxSize } from '../types';

export const DEVICE_PRESETS: Record<string, { name: string; dimensions: BoxSize; borderRadius: number }> = {
    'iphone-14-pro': {
        name: 'iPhone 14 Pro',
        dimensions: { width: 393, height: 852 },
        borderRadius: 40
    },
    'iphone-se': {
        name: 'iPhone SE',
        dimensions: { width: 375, height: 667 },
        borderRadius: 0 // SE usually has square corners or very small radius if we consider the screen, but let's say 0 for now or standard
    },
    'pixel-7': {
        name: 'Pixel 7',
        dimensions: { width: 412, height: 915 },
        borderRadius: 24
    },
    'ipad-mini': {
        name: 'iPad Mini',
        dimensions: { width: 744, height: 1133 },
        borderRadius: 12
    },
    'ipad-pro-11': {
        name: 'iPad Pro 11"',
        dimensions: { width: 834, height: 1194 },
        borderRadius: 16
    },
    'desktop-hd': {
        name: 'Desktop HD',
        dimensions: { width: 1280, height: 720 },
        borderRadius: 0
    },
    'desktop-fhd': {
        name: 'Desktop FHD',
        dimensions: { width: 1920, height: 1080 },
        borderRadius: 0
    },
    'custom': {
        name: 'Custom',
        dimensions: { width: 800, height: 600 },
        borderRadius: 0
    }
};

export type DevicePresetKey = keyof typeof DEVICE_PRESETS;
