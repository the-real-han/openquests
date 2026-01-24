import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';
import type { Player } from '../types';
import { useGameState } from '../hooks/useGameState';

interface MockUser {
    username: string;
    avatarUrl: string;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: MockUser | null;
    login: () => void;
    logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock GitHub user
const MOCK_USER: MockUser = {
    username: 'player1',
    avatarUrl: 'https://avatars.githubusercontent.com/u/1'
};

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<MockUser | null>(null);

    const login = () => {
        setIsLoggedIn(true);
        setUser(MOCK_USER);
    };

    const logout = () => {
        setIsLoggedIn(false);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}

// Hook to get current player from gamestate
export function useCurrentPlayer(): Player | null {
    const { isLoggedIn, user } = useAuth();
    const { data } = useGameState();

    if (!isLoggedIn || !user || !data) {
        return null;
    }

    // Find player by matching github.username
    const playerEntry = Object.values(data.players).find(
        (player) => player.github.username === user.username
    );

    return playerEntry || null;
}
