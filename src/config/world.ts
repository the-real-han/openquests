/**
 * Central configuration for world data sources.
 */

// The default playground world state URL
const DEFAULT_WORLD_STATE_URL = 'https://raw.githubusercontent.com/the-real-han/openquests-playground/master/gamestate.json';

/**
 * The resolved URL to fetch the game state from.
 * Prioritizes VITE_WORLD_STATE_URL environment variable, 
 * falling back to the official playground URL.
 */
export const WORLD_STATE_URL = import.meta.env.VITE_WORLD_STATE_URL || DEFAULT_WORLD_STATE_URL;
