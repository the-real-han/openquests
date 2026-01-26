import { useState, useEffect } from 'react';

interface PendingAction {
    day: number;
    action: string;
}

interface UsePendingActionResult {
    pendingAction: string | null;
    setPendingAction: (action: string) => void;
    clearPendingAction: () => void;
}

/**
 * Hook to manage pending actions in localStorage
 * Automatically clears pending action when the day changes
 * 
 * @param playerId - The player's ID
 * @param currentDay - The current world day
 * @returns Object with pendingAction, setPendingAction, and clearPendingAction
 */
export function usePendingAction(playerId: number, currentDay: number): UsePendingActionResult {
    const storageKey = `pending_action_${playerId}`;
    const [pendingAction, setPendingActionState] = useState<string | null>(null);

    // Load pending action from localStorage on mount and when day changes
    useEffect(() => {
        const stored = localStorage.getItem(storageKey);
        if (stored) {
            try {
                const parsed: PendingAction = JSON.parse(stored);

                // Clear if day has changed
                if (parsed.day !== currentDay) {
                    localStorage.removeItem(storageKey);
                    setPendingActionState(null);
                } else {
                    setPendingActionState(parsed.action);
                }
            } catch (error) {
                console.error('Failed to parse pending action:', error);
                localStorage.removeItem(storageKey);
                setPendingActionState(null);
            }
        }
    }, [playerId, currentDay, storageKey]);

    const setPendingAction = (action: string) => {
        const data: PendingAction = {
            day: currentDay,
            action,
        };
        localStorage.setItem(storageKey, JSON.stringify(data));
        setPendingActionState(action);
    };

    const clearPendingAction = () => {
        localStorage.removeItem(storageKey);
        setPendingActionState(null);
    };

    return {
        pendingAction,
        setPendingAction,
        clearPendingAction,
    };
}
