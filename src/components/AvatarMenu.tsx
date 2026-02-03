import { useState, useRef, useEffect } from 'react';
import { useAuth, useCurrentPlayer } from '../contexts/AuthContext';
import StartAdventureDialog from './StartAdventureDialog';

export default function AvatarMenu() {
    const { user, logout } = useAuth();
    const { currentPlayer, location } = useCurrentPlayer();
    const [isOpen, setIsOpen] = useState(false);
    const [showStartAdventure, setShowStartAdventure] = useState(false);
    const menuRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleGoToCharacter = () => {
        if (currentPlayer) {
            window.location.hash = `#/location/${location}`;
        }
        setIsOpen(false);
    };

    const handleStartAdventure = () => {
        setIsOpen(false);
        setShowStartAdventure(true);
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        window.location.hash = '#/';
    };

    if (!user) return null;

    return (
        <>
            <div className="relative" ref={menuRef}>
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="hover:bg-[#24292F] bg-[#24292F]/90 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-all shadow-md hover:shadow-lg flex items-center gap-3 border border-slate-700 hover:cursor-pointer"
                    aria-label="User menu"
                >
                    <img
                        src={user.avatarUrl}
                        alt={user.username}
                        className="w-8 h-8 rounded-full border-2 border-slate-600"
                    />
                    <span className="text-sm hidden sm:inline">{user.username}</span>
                </button>


                {isOpen && (
                    <div className="absolute right-0 mt-2 w-48 bg-slate-800 rounded-lg shadow-lg border border-slate-700 py-1 z-50">
                        {currentPlayer ? (
                            <>
                                <button
                                    onClick={handleGoToCharacter}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition"
                                >
                                    🏰 My clan
                                </button>
                                <hr className="border-slate-700 my-1" />
                            </>
                        ) : (
                            <>
                                <button
                                    onClick={handleStartAdventure}
                                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition"
                                >
                                    ⚔️ Start an adventure
                                </button>
                                <hr className="border-slate-700 my-1" />
                            </>
                        )}

                        <button
                            onClick={handleLogout}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition"
                        >
                            🚪 Log out
                        </button>
                    </div>
                )}
            </div>

            {showStartAdventure && (
                <StartAdventureDialog
                    onClose={() => setShowStartAdventure(false)}
                    onSuccess={() => {
                        // Success handled in dialog, maybe refresh gamestate here if needed
                        // But gamestate polling should pick it up eventually, or we could force a reload
                        // For now we trust the dialog's success message flow
                        setShowStartAdventure(false);
                    }}
                />
            )}
        </>
    );
}
