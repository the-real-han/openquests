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
    CREATE_CHARACTER: `${AUTH_WORKER_URL}/api/create-character`,
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

export interface CharacterData {
    characterName: string;
    characterClass: string;
    backstory: string;
}

export async function createCharacter(
    token: string,
    data: CharacterData
): Promise<void> {
    const response = await fetch(AUTH_ENDPOINTS.CREATE_CHARACTER, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            world: WORLD_REPO,
            ...data,
        }),
    });

    if (!response.ok) {
        // 409 is treated as success in the UI flow (user gets "A clan will accept you..." message)
        // enabling them to proceed as if it worked, though technically it means they already have one pending/active
        if (response.status === 409) {
            return;
        }

        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(error.message || response.statusText || 'Failed to create character');
    }
}
