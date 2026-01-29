import { useState } from 'react';
import { createCharacter } from '../config/auth';
import { AUTH_TOKEN_KEY } from '../config/auth';

interface StartAdventureDialogProps {
    onClose: () => void;
    onSuccess: () => void;
}

const CHARACTER_CLASSES = [
    { value: 'Archer', label: 'Archer' },
    { value: 'Warrior', label: 'Warrior' },
    { value: 'Lancer', label: 'Lancer' },
    { value: 'Monk', label: 'Monk' },
    { value: 'Adventurer', label: 'Adventurer' },
];

export default function StartAdventureDialog({ onClose, onSuccess }: StartAdventureDialogProps) {
    const [name, setName] = useState('');
    const [characterClass, setCharacterClass] = useState(CHARACTER_CLASSES[0].value);
    const [backstory, setBackstory] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [showSuccess, setShowSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const token = localStorage.getItem(AUTH_TOKEN_KEY);
        if (!token) {
            setError('You must be logged in to create a character');
            return;
        }

        setIsSubmitting(true);
        setError(null);

        try {
            await createCharacter(token, {
                characterName: name,
                characterClass,
                backstory,
            });
            setShowSuccess(true);
            setTimeout(() => {
                onSuccess();
                onClose();
            }, 2000);
        } catch (err: any) {
            setError(err.message || 'Failed to create character');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (showSuccess) {
        return (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
                <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 max-w-md w-full shadow-2xl text-center animate-in fade-in zoom-in duration-300">
                    <div className="mb-4 text-4xl">🏰</div>
                    <h2 className="text-2xl font-bold text-white mb-2">Adventure Awaits!</h2>
                    <p className="text-slate-300">A clan will accept you at dawn!</p>
                </div>
            </div>
        );
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
            <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 max-w-md w-full shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-slate-400 hover:text-white transition-colors"
                    aria-label="Close dialog"
                >
                    ✕
                </button>

                <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-2">
                    <span>⚔️</span> Start an Adventure
                </h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-slate-300 mb-1">
                            Character Name
                        </label>
                        <input
                            type="text"
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                            placeholder="Enter your hero's name"
                            required
                            maxLength={32}
                        />
                    </div>

                    <div>
                        <label htmlFor="class" className="block text-sm font-medium text-slate-300 mb-1">
                            Class
                        </label>
                        <select
                            id="class"
                            value={characterClass}
                            onChange={(e) => setCharacterClass(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                        >
                            {CHARACTER_CLASSES.map((c) => (
                                <option key={c.value} value={c.value}>
                                    {c.label}
                                </option>
                            ))}
                        </select>
                    </div>

                    <div>
                        <label htmlFor="backstory" className="block text-sm font-medium text-slate-300 mb-1">
                            Backstory <span className="text-slate-500 text-xs">(Optional)</span>
                        </label>
                        <textarea
                            id="backstory"
                            value={backstory}
                            onChange={(e) => setBackstory(e.target.value)}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-3 py-2 text-white focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all h-24 resize-none"
                            placeholder="Tell us about your past..."
                            maxLength={500}
                        />
                    </div>

                    {error && (
                        <div className="bg-red-500/10 border border-red-500/20 text-red-400 text-sm p-3 rounded-lg flex items-center gap-2">
                            <span>⚠️</span> {error}
                        </div>
                    )}

                    <div className="flex justify-end gap-3 pt-4 border-t border-slate-700/50 mt-6">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="bg-blue-600 hover:bg-blue-500 text-white px-6 py-2 rounded-lg text-sm font-semibold transition-all shadow-lg shadow-blue-900/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                        >
                            {isSubmitting ? (
                                <>
                                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                                    Creating...
                                </>
                            ) : (
                                'Begin Adventure'
                            )}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
