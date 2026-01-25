/**
 * Authentication configuration for GitHub OAuth via Cloudflare Worker
 */

// Cloudflare Worker base URL
const DEFAULT_AUTH_WORKER_URL = 'https://openquests-auth.therealhan.workers.dev';

/**
 * The resolved URL for the auth worker.
 * Can be overridden via VITE_AUTH_WORKER_URL environment variable.
 */
export const AUTH_WORKER_URL = import.meta.env.VITE_AUTH_WORKER_URL || DEFAULT_AUTH_WORKER_URL;

/**
 * Auth API endpoints
 */
export const AUTH_ENDPOINTS = {
    GITHUB_LOGIN: `${AUTH_WORKER_URL}/auth/github`,
    CALLBACK: `${AUTH_WORKER_URL}/auth/github/callback`,
    ME: `${AUTH_WORKER_URL}/auth/me`,
    LOGOUT: `${AUTH_WORKER_URL}/auth/logout`,
} as const;

/**
 * Local storage key for auth token
 */
export const AUTH_TOKEN_KEY = 'auth_token';
