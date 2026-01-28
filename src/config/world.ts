/**
 * Central configuration for world data sources.
 */

// The default playground world state URL
export const WORLD_REPO = import.meta.env.VITE_WORLD_REPO || 'openquests-playground';

/**
 * The resolved URL to fetch the game state from.
 * Prioritizes VITE_WORLD_REPO environment variable, 
 * falling back to the official playground URL.
 */

export const WORLD_STATE_URL = `https://raw.githubusercontent.com/the-real-han/${WORLD_REPO}/main/gamestate.json`;
