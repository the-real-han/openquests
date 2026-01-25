import { useState, useRef, useEffect } from 'react';
import { useAuth, useCurrentPlayer } from '../contexts/AuthContext';

export default function AvatarMenu() {
    const { user, logout } = useAuth();
    const currentPlayer = useCurrentPlayer();
    const [isOpen, setIsOpen] = useState(false);
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
            window.location.hash = `#/location/${currentPlayer.location}`;
        }
        setIsOpen(false);
    };

    const handleLogout = () => {
        logout();
        setIsOpen(false);
        window.location.hash = '#/';
    };

    if (!user) return null;

    return (
        <div className="relative" ref={menuRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 hover:opacity-80 transition"
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
                    {currentPlayer && (
                        <button
                            onClick={handleGoToCharacter}
                            className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition"
                        >
                            🏰 Go to my character
                        </button>
                    )}
                    {currentPlayer && <hr className="border-slate-700 my-1" />}
                    <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-sm hover:bg-slate-700 transition"
                    >
                        🚪 Log out
                    </button>
                </div>
            )}
        </div>
    );
}
