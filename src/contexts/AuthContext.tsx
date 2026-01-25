import { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import type { Player } from '@openquests/schema';
import { useGameState } from '../hooks/useGameState';
import { AUTH_ENDPOINTS, AUTH_TOKEN_KEY } from '../config/auth';

interface GitHubUser {
    username: string;
    avatarUrl: string;
    id: number;
}

interface AuthContextType {
    isLoggedIn: boolean;
    user: GitHubUser | null;
    login: () => void;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [user, setUser] = useState<GitHubUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    // Handle OAuth callback and token validation on mount
    useEffect(() => {
        const initAuth = async () => {
            // Check for token in URL (OAuth callback)
            const urlParams = new URLSearchParams(window.location.search);
            const tokenFromUrl = urlParams.get('token');

            if (tokenFromUrl) {
                // Store token and clean URL
                localStorage.setItem(AUTH_TOKEN_KEY, tokenFromUrl);
                window.history.replaceState({}, document.title, window.location.pathname + window.location.hash);
            }

            // Try to restore session from stored token
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            if (token) {
                await validateToken(token);
            }

            setIsLoading(false);
        };

        initAuth();
    }, []);

    const validateToken = async (token: string) => {
        try {
            const response = await fetch(AUTH_ENDPOINTS.ME, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                },
            });

            if (response.ok) {
                const userData = await response.json();
                setUser({
                    username: userData.username,
                    avatarUrl: userData.avatarUrl,
                    id: userData.id,
                });
                setIsLoggedIn(true);
            } else {
                // Token invalid or expired
                localStorage.removeItem(AUTH_TOKEN_KEY);
                setIsLoggedIn(false);
                setUser(null);
            }
        } catch (error) {
            console.error('Failed to validate token:', error);
            localStorage.removeItem(AUTH_TOKEN_KEY);
            setIsLoggedIn(false);
            setUser(null);
        }
    };

    const login = () => {
        // Redirect to Cloudflare Worker OAuth endpoint
        window.location.href = AUTH_ENDPOINTS.GITHUB_LOGIN;
    };

    const logout = async () => {
        // Clear local state
        setIsLoggedIn(false);
        setUser(null);
        localStorage.removeItem(AUTH_TOKEN_KEY);

        // Optionally notify server
        try {
            await fetch(AUTH_ENDPOINTS.LOGOUT, {
                method: 'POST',
            });
        } catch (error) {
            console.error('Logout request failed:', error);
        }
    };

    return (
        <AuthContext.Provider value={{ isLoggedIn, user, login, logout, isLoading }}>
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

