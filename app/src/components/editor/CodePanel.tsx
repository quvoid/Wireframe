import { useProjectStore } from '../../store/projectStore';
import { generateComponentCode } from '../../utils/codeGenerator';
import { Copy, Code, Check } from 'lucide-react';
import { useState, useEffect } from 'react';

export function CodePanel() {
    const selectedComponentIds = useProjectStore(state => state.selectedComponentIds);
    const screens = useProjectStore(state => state.project.screens);

    const [copied, setCopied] = useState(false);

    // Find the selected component object
    const selectedComponent = screens
        .flatMap(s => s.components)
        .find(c => selectedComponentIds.includes(c.id));

    useEffect(() => {
        setCopied(false);
    }, [selectedComponentIds]);

    if (!selectedComponent) return null;

    const code = generateComponentCode(selectedComponent);

    const handleCopy = () => {
        navigator.clipboard.writeText(code);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    return (
        <div className="flex flex-col h-full bg-neutral-900 w-full">
            <div className="p-4 border-b border-neutral-800 flex items-center justify-between">
                <div className="flex items-center gap-2 text-neutral-400">
                    <Code size={16} />
                    <span className="text-xs font-bold uppercase tracking-wider">React Code</span>
                </div>
                <button
                    onClick={handleCopy}
                    className="p-1.5 hover:bg-neutral-800 rounded-md text-neutral-400 hover:text-white transition-colors"
                    title="Copy to Clipboard"
                >
                    {copied ? <Check size={16} className="text-green-500" /> : <Copy size={16} />}
                </button>
            </div>
            <div className="flex-1 overflow-auto p-4 bg-neutral-950/50">
                <pre className="text-xs font-mono text-neutral-300 leading-relaxed whitespace-pre-wrap">
                    {code}
                </pre>
            </div>
            <div className="p-3 border-t border-neutral-800 text-[10px] text-neutral-500 text-center">
                Generated JSX + Tailwind
            </div>
        </div>
    );
}
