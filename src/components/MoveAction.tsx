import { useState } from 'react';
import type { Player, LocationState } from '@openquests/schema';
import { postIssueComment } from '../config/auth';
import { AUTH_TOKEN_KEY } from '../config/auth';

interface MoveActionProps {
    player: Player;
    exits: string[];
    locations: Record<string, LocationState>;
    onActionSubmit: (action: string) => void;
}

export default function MoveAction({ player, exits, locations, onActionSubmit }: MoveActionProps) {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [submitStatus, setSubmitStatus] = useState<'idle' | 'success' | 'error'>('idle');
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    const handleSubmit = async (destinationId: string) => {
        setIsSubmitting(true);
        setSubmitStatus('idle');
        setErrorMessage(null);

        try {
            // Get auth token
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            if (!token) {
                throw new Error('Not authenticated. Please log in again.');
            }

            // Format action comment
            const actionComment = `MOVE ${destinationId}`;

            // Post comment to player's GitHub issue
            await postIssueComment(player.github.issueNumber, actionComment, token);

            // Update parent component
            onActionSubmit(actionComment);

            // Show success feedback
            setSubmitStatus('success');
            setIsDropdownOpen(false);

            // Auto-dismiss success message
            setTimeout(() => {
                setSubmitStatus('idle');
            }, 3000);
        } catch (error) {
            console.error('Failed to submit action:', error);
            setSubmitStatus('error');
            setErrorMessage(error instanceof Error ? error.message : 'Failed to submit action');
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleRetry = () => {
        setSubmitStatus('idle');
        setErrorMessage(null);
    };

    return (
        <div className="space-y-2">
            {/* Move Button */}
            <div className="relative">
                <button
                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                    disabled={isSubmitting}
                    className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white px-4 py-2 rounded-lg font-medium transition flex items-center gap-2"
                >
                    <span>🚶</span>
                    <span>Move</span>
                </button>

                {/* Dropdown */}
                {isDropdownOpen && (
                    <div className="absolute left-0 mt-2 w-64 bg-white border-2 border-amber-600 rounded-lg shadow-lg z-10">
                        <div className="p-2">
                            <div className="text-sm font-semibold text-amber-900 mb-2 px-2">
                                Select Destination:
                            </div>
                            <div className="space-y-1">
                                {exits.length > 0 ? (
                                    exits.map((exitId) => {
                                        const exitLocation = locations[exitId];
                                        return exitLocation ? (
                                            <button
                                                key={exitId}
                                                onClick={() => handleSubmit(exitId)}
                                                disabled={isSubmitting}
                                                className="w-full text-left px-3 py-2 rounded hover:bg-amber-100 disabled:opacity-50 text-amber-900 transition"
                                            >
                                                {exitLocation.name}
                                            </button>
                                        ) : null;
                                    })
                                ) : (
                                    <div className="px-3 py-2 text-sm text-amber-700 italic">
                                        No exits available
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={() => setIsDropdownOpen(false)}
                                className="w-full mt-2 px-3 py-1 text-sm text-amber-700 hover:bg-amber-50 rounded"
                            >
                                Cancel
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Success Message */}
            {submitStatus === 'success' && (
                <div className="text-sm text-green-700 font-medium">
                    ✓ Submitted
                </div>
            )}

            {/* Error Message */}
            {submitStatus === 'error' && (
                <div className="text-sm text-red-700">
                    <p>{errorMessage || 'Failed to submit action'}</p>
                    <button
                        onClick={handleRetry}
                        className="text-blue-600 hover:underline mt-1"
                    >
                        Retry
                    </button>
                </div>
            )}
        </div>
    );
}
