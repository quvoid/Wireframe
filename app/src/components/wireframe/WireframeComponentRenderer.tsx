import type { WireframeComponent } from '../../types';
import { cn } from '../../utils/cn';
import { useProjectStore } from '../../store/projectStore';

interface Props {
    component: WireframeComponent;
}

export function WireframeComponentRenderer({ component }: Props) {
    const theme = useProjectStore(state => state.project.theme);

    switch (component.type) {
        case 'rectangle':
            return (
                <div
                    className="w-full h-full border border-neutral-400"
                    style={{
                        backgroundColor: component.properties.background || '#e5e5e5',
                        borderRadius: theme.borderRadius
                    }}
                />
            );
        case 'line':
            return (
                <div className="w-full h-full flex items-center justify-center pointer-events-none">
                    <div className="w-full h-[2px] bg-neutral-400" />
                </div>
            );
        case 'button':
            return (
                <button
                    className={cn(
                        "w-full h-full flex items-center justify-center transition-colors text-sm font-medium",
                        component.properties.variant === 'secondary' ? "bg-neutral-200 text-neutral-900" :
                            component.properties.variant === 'ghost' ? "border border-neutral-300 bg-transparent text-neutral-900" :
                                "text-white"
                    )}
                    style={{
                        backgroundColor: component.properties.variant === 'primary' || !component.properties.variant ? theme.primaryColor : undefined,
                        borderRadius: theme.borderRadius
                    }}
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
        case 'image':
            return (
                <div className="w-full h-full bg-neutral-200 flex items-center justify-center relative overflow-hidden group">
                    <div className="absolute inset-0 flex items-center justify-center text-neutral-400">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                            <circle cx="8.5" cy="8.5" r="1.5" />
                            <polyline points="21 15 16 10 5 21" />
                        </svg>
                    </div>
                    {component.properties.text && (
                        <span className="absolute bottom-2 left-2 text-[10px] bg-black/50 text-white px-1 rounded">
                            {component.properties.text}
                        </span>
                    )}
                </div>
            );
        case 'avatar':
            return (
                <div className="w-full h-full bg-neutral-300 rounded-full flex items-center justify-center overflow-hidden border border-neutral-200">
                    <svg width="60%" height="60%" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-neutral-500">
                        <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                        <circle cx="12" cy="7" r="4" />
                    </svg>
                </div>
            );
        case 'toggle':
            return (
                <div className="w-full h-full flex items-center">
                    <div
                        className={`w-11 h-6 rounded-full p-1 transition-colors ${component.properties.value ? '' : 'bg-neutral-300'}`}
                        style={{ backgroundColor: component.properties.value ? theme.primaryColor : undefined }}
                    >
                        <div className={`bg-white w-4 h-4 rounded-full shadow-sm transform transition-transform ${component.properties.value ? 'translate-x-5' : 'translate-x-0'}`} />
                    </div>
                </div>
            );
        case 'checkbox':
            return (
                <div className="w-full h-full flex items-center gap-2">
                    <div
                        className={`w-5 h-5 border rounded flex items-center justify-center ${component.properties.value ? 'text-white' : 'border-neutral-400 bg-white'}`}
                        style={{
                            backgroundColor: component.properties.value ? theme.primaryColor : undefined,
                            borderColor: component.properties.value ? theme.primaryColor : undefined
                        }}
                    >
                        {component.properties.value && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><polyline points="20 6 9 17 4 12" /></svg>}
                    </div>
                    {component.properties.label && <span className="text-sm">{component.properties.label}</span>}
                </div>
            );
        case 'sticky-note':
            return (
                <div className="w-full h-full p-4 shadow-lg rotate-1 flex flex-col gap-2 transition-transform hover:rotate-0" style={{ backgroundColor: component.properties.color || '#fef3c7' }}>
                    <div className="w-8 h-2 bg-black/5 mx-auto rounded-full mb-1 opacity-50" />
                    <div className="font-handwriting text-neutral-800 text-sm leading-relaxed overflow-hidden whitespace-pre-wrap flex-1" style={{ fontFamily: '"Comic Sans MS", "Chalkboard SE", sans-serif' }}>
                        {component.properties.text || 'Add a note...'}
                    </div>
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
