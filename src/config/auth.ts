/**
 * Authentication configuration for GitHub OAuth via Cloudflare Worker
 */

import { WORLD_REPO } from "./world";

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

export const ACTION_ENDPOINT = `${AUTH_WORKER_URL}/action`;

/**
 * Local storage key for auth token
 */
export const AUTH_TOKEN_KEY = 'auth_token';


export async function postIssueComment(
    issueNumber: number,
    comment: string,
    token: string
): Promise<void> {
    const response = await fetch(ACTION_ENDPOINT, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            world: WORLD_REPO,
            issueNumber,
            comment,
        }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Failed to post comment: ${error.message || response.statusText}`);
    }
}
