import type { Player, ActionType, LocationState } from '@openquests/schema';
import { postIssueComment } from '../config/auth';
import { AUTH_TOKEN_KEY } from '../config/auth';
import { Sprite } from './Sprite';

interface ActionProps {
    player: Player;
    action: ActionType;
    target: LocationState | string;
    pngSrc: string;
    pngProps?: {
        name: string;
        size: number;
        frames: number;
        crop: number;
    };
    onActionSubmit: (action: string, feedback: string) => void;
}

export default function ActionButton({ player, action, target, pngSrc, pngProps = {
    name: "",
    size: 192,
    frames: 6,
    crop: .7
}, onActionSubmit }: ActionProps) {

    const handleSubmit = async () => {
        try {
            // Get auth token
            const token = localStorage.getItem(AUTH_TOKEN_KEY);
            if (!token) {
                throw new Error('Not authenticated. Please log in again.');
            }

            // Format action comment
            const actionComment = `${action} ${typeof target === 'string' ? target : target.id}`;

            // Post comment to player's GitHub issue
            await postIssueComment(player.github.issueNumber, actionComment, token);

            // Update parent component
            onActionSubmit(`${action} [${typeof target === 'string' ? target : target.name}]`, "");
        } catch (error) {
            console.error('Failed to submit action:', error);
            onActionSubmit("", error instanceof Error ? error.message : 'Failed to submit action');
        }
    };

    return (
        <Sprite src={pngSrc} frameSize={pngProps.size} frames={pngProps.frames} cropRatio={pngProps.crop} onClick={handleSubmit} />
    );
}
