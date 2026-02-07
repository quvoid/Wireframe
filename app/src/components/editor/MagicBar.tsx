import { useState, useRef, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import { useProjectStore } from '../../store/projectStore';
import { v4 as uuidv4 } from 'uuid';

export function MagicBar() {
    const [input, setInput] = useState('');
    const [isOpen, setIsOpen] = useState(false);
    const [isGenerating, setIsGenerating] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const addComponent = useProjectStore(state => state.addComponent);
    const activeScreenId = useProjectStore(state => state.activeScreenId);

    // Keyboard shortcut to open (Cmd+K is common)
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
                e.preventDefault();
                setIsOpen(true);
                setTimeout(() => inputRef.current?.focus(), 100);
            }
            if (e.key === 'Escape') {
                setIsOpen(false);
            }
        };
        window.addEventListener('keydown', handleKeyDown);
        return () => window.removeEventListener('keydown', handleKeyDown);
    }, []);

    const handleGenerate = async () => {
        if (!input.trim() || !activeScreenId) return;

        setIsGenerating(true);

        // Mock AI delay
        await new Promise(resolve => setTimeout(resolve, 1500));

        const query = input.toLowerCase();

        if (query.includes('login') || query.includes('sign in')) {
            // Generate Login Form
            addComponent(activeScreenId, { type: 'text', name: 'Title', position: { x: 40, y: 100 }, size: { width: 300, height: 40 }, properties: { text: 'Welcome Back', fontSize: 24 } });
            addComponent(activeScreenId, { type: 'input', name: 'Email', position: { x: 40, y: 160 }, size: { width: 300, height: 60 }, properties: { label: 'Email Address', placeholder: 'you@example.com' } });
            addComponent(activeScreenId, { type: 'input', name: 'Password', position: { x: 40, y: 240 }, size: { width: 300, height: 60 }, properties: { label: 'Password', placeholder: '••••••••' } });
            addComponent(activeScreenId, { type: 'button', name: 'Submit', position: { x: 40, y: 320 }, size: { width: 300, height: 40 }, properties: { text: 'Sign In', variant: 'primary' } });
            addComponent(activeScreenId, { type: 'text', name: 'Link', position: { x: 40, y: 380 }, size: { width: 300, height: 20 }, properties: { text: 'Forgot password?', fontSize: 14 } });
        } else if (query.includes('profile')) {
            // Generate Profile
            addComponent(activeScreenId, { type: 'avatar', name: 'Avatar', position: { x: 140, y: 100 }, size: { width: 100, height: 100 }, properties: { borderRadius: 'full' } });
            addComponent(activeScreenId, { type: 'text', name: 'Name', position: { x: 40, y: 220 }, size: { width: 300, height: 30 }, properties: { text: 'Alex Johnson', fontSize: 20 } });
            addComponent(activeScreenId, { type: 'text', name: 'Role', position: { x: 40, y: 250 }, size: { width: 300, height: 20 }, properties: { text: 'Product Designer', fontSize: 14 } });
            addComponent(activeScreenId, { type: 'button', name: 'Edit', position: { x: 100, y: 300 }, size: { width: 180, height: 40 }, properties: { text: 'Edit Profile', variant: 'secondary' } });
        } else if (query.includes('dashboard')) {
            // Generate Dashboard
            addComponent(activeScreenId, { type: 'text', name: 'Header', position: { x: 20, y: 40 }, size: { width: 200, height: 30 }, properties: { text: 'Dashboard', fontSize: 24 } });

            addComponent(activeScreenId, { type: 'card', name: 'Stat 1', position: { x: 20, y: 90 }, size: { width: 160, height: 100 }, properties: { title: 'Total Users' } });
            addComponent(activeScreenId, { type: 'text', name: 'Val 1', position: { x: 40, y: 140 }, size: { width: 100, height: 30 }, properties: { text: '1,234', fontSize: 24 } });

            addComponent(activeScreenId, { type: 'card', name: 'Stat 2', position: { x: 200, y: 90 }, size: { width: 160, height: 100 }, properties: { title: 'Revenue' } });
            addComponent(activeScreenId, { type: 'text', name: 'Val 2', position: { x: 220, y: 140 }, size: { width: 100, height: 30 }, properties: { text: '$45k', fontSize: 24 } });

            addComponent(activeScreenId, { type: 'card', name: 'Chart', position: { x: 20, y: 210 }, size: { width: 340, height: 200 }, properties: { title: 'Analytics' } });
        } else {
            // Default Fallback
            addComponent(activeScreenId, { type: 'sticky-note', name: 'Note', position: { x: 100, y: 200 }, size: { width: 200, height: 200 }, properties: { text: `I couldn't generate "${input}" yet, but imagine it here!`, color: '#fef3c7' } });
        }

        setIsGenerating(false);
        setIsOpen(false);
        setInput('');
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-gradient-to-r from-purple-600 to-indigo-600 text-white p-4 rounded-full shadow-lg hover:scale-105 transition-transform z-50 group"
                title="AI Magic (Ctrl+K)"
            >
                <Sparkles size={24} className="group-hover:animate-pulse" />
            </button>
        );
    }

    return (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <div className="bg-neutral-900 border border-neutral-700 w-full max-w-lg rounded-2xl shadow-2xl p-2 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-r from-purple-500/10 to-blue-500/10 pointer-events-none" />

                <div className="relative flex items-center gap-3 px-3 py-2">
                    <Sparkles className={`text-purple-400 ${isGenerating ? 'animate-spin' : ''}`} size={20} />
                    <input
                        ref={inputRef}
                        type="text"
                        value={input}
                        onChange={e => setInput(e.target.value)}
                        onKeyDown={e => e.key === 'Enter' && handleGenerate()}
                        placeholder="Describe what you want to build (e.g., 'Login screen')..."
                        className="flex-1 bg-transparent border-none text-white text-lg placeholder-neutral-500 focus:outline-none"
                    />
                    <button
                        onClick={handleGenerate}
                        disabled={!input.trim() || isGenerating}
                        className="p-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors disabled:opacity-50"
                    >
                        <ArrowRight size={20} className="text-white" />
                    </button>
                </div>

                {isGenerating && (
                    <div className="h-0.5 w-full bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 animate-gradient-x" />
                )}
            </div>

            <div className="absolute inset-0 -z-10" onClick={() => setIsOpen(false)} />
        </div>
    );
}
