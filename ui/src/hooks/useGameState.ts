import { useState, useEffect } from 'react';
import type { GameState } from '@openquests/schema';
import { WORLD_STATE_URL } from '../config/world';

interface UseGameStateResult {
    data: GameState | null;
    loading: boolean;
    error: string | null;
}

export function useGameState(): UseGameStateResult {
    const [data, setData] = useState<GameState | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(WORLD_STATE_URL)
            .then((response) => {
                if (!response.ok) {
                    throw new Error(`Failed to fetch gamestate: ${response.statusText}`);
                }
                return response.json();
            })
            .then((gameState: GameState) => {
                setData(gameState);
                setLoading(false);
            })
            .catch((err) => {
                setError(err.message || 'Failed to load game state');
                setLoading(false);
            });
    }, []);

    return { data, loading, error };
}
