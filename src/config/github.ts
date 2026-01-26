/**
 * GitHub API configuration for OpenQuests
 */

import { WORLD_REPO } from "./world";

// GitHub repository information
const GITHUB_OWNER = 'the-real-han';

/**
 * GitHub API base URL
 */
export const GITHUB_API_BASE = 'https://api.github.com';

/**
 * Repository API endpoint
 */
export const REPO_API = `${GITHUB_API_BASE}/repos/${GITHUB_OWNER}/${WORLD_REPO}`;

/**
 * Post a comment to a GitHub issue
 * @param issueNumber - The issue number to comment on
 * @param comment - The comment text
 * @param token - GitHub OAuth token
 * @returns Promise that resolves when comment is posted
 */
export async function postIssueComment(
    issueNumber: number,
    comment: string,
    token: string
): Promise<void> {
    const response = await fetch(`${REPO_API}/issues/${issueNumber}/comments`, {
        method: 'POST',
        headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/vnd.github.v3+json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ body: comment }),
    });

    if (!response.ok) {
        const error = await response.json().catch(() => ({ message: response.statusText }));
        throw new Error(`Failed to post comment: ${error.message || response.statusText}`);
    }
}
