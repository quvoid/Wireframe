import type { WireframeComponent } from '../../types';
import { cn } from '../../utils/cn';

interface Props {
    component: WireframeComponent;
}

export function WireframeComponentRenderer({ component }: Props) {
    switch (component.type) {
        case 'button':
            return (
                <button
                    className={cn(
                        "w-full h-full flex items-center justify-center rounded transition-colors text-sm font-medium",
                        component.properties.variant === 'primary' ? "bg-blue-600 text-white" :
                            component.properties.variant === 'secondary' ? "bg-neutral-200 text-neutral-900" :
                                "border border-neutral-300 bg-transparent text-neutral-900"
                    )}
                >
                    {component.properties.text || 'Button'}
                </button>
            );
        case 'input':
            return (
                <div className="w-full h-full flex flex-col gap-1 pointer-events-none">
                    {component.properties.label && (
                        <label className="text-xs font-medium text-neutral-500">{component.properties.label}</label>
                    )}
                    <input
                        type="text"
                        placeholder={component.properties.placeholder || 'Type here...'}
                        className="w-full h-full border border-neutral-300 rounded px-2 text-sm bg-white"
                        readOnly
                    />
                </div>
            );
        case 'card':
            return (
                <div className="w-full h-full bg-white border border-neutral-200 rounded-lg shadow-sm p-4 flex flex-col gap-2">
                    {component.properties.title && (
                        <h3 className="font-semibold text-neutral-900 text-sm">{component.properties.title}</h3>
                    )}
                    <div className="flex-1 bg-neutral-50 rounded"></div>
                </div>
            );
        case 'text':
            return (
                <div className="w-full h-full flex items-center" style={{ fontSize: component.properties.fontSize || 16 }}>
                    {component.properties.text || 'Text'}
                </div>
            );
        default:
            return (
                <div className="w-full h-full border-2 border-dashed border-red-300 bg-red-50 flex items-center justify-center text-xs text-red-500">
                    Unknown: {component.type}
                </div>
            );
    }
}
