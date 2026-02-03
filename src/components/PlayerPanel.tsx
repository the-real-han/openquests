import type { Player, LocationState } from '@openquests/schema';
import { usePendingAction } from '../hooks/usePendingAction';

interface PlayerPanelProps {
    player: Player;
    location: LocationState;
    allLocations: Record<string, LocationState>;
    currentDay: number;
}

export default function PlayerPanel({ player, location, allLocations, currentDay }: PlayerPanelProps) {
    const { pendingAction, setPendingAction } = usePendingAction(player.playerId, currentDay);

    const handleActionSubmit = (action: string) => {
        setPendingAction(action);
    };

    // Parse pending action to get destination name
    const getPendingActionDisplay = () => {
        if (!pendingAction) return null;

        // Parse "MOVE <location_id>" format
        const match = pendingAction.match(/^MOVE\s+(.+)$/);
        if (match) {
            const destinationId = match[1];
            const destination = allLocations[destinationId];
            return destination ? `MOVE to ${destination.name}` : pendingAction;
        }

        return pendingAction;
    };

    return (
        <section className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-600 rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚔️</span>
                <h2 className="text-2xl font-bold text-amber-900">Your Character</h2>
            </div>

            <div className="space-y-3 text-amber-900">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Adventurer:</span>
                    <span className="text-lg">{player.character.name}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-semibold">Class:</span>
                    <span className="bg-amber-200 px-3 py-1 rounded-full text-sm font-medium">
                        {player.character.class}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-semibold">Clan:</span>
                    <span>{player.character.clanId}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <span className="text-green-700 font-medium">
                        {player.status.alive ? '✓ Healthy' : '💀 Deceased'}
                    </span>
                </div>
            </div>

            {/* Pending Action Display */}
            {pendingAction && (
                <div className="mt-4 p-3 bg-amber-200 border border-amber-400 rounded-lg">
                    <div className="flex items-center gap-2 text-amber-900">
                        <span className="text-lg">⏳</span>
                        <span className="font-semibold">Pending Action:</span>
                        <span>{getPendingActionDisplay()}</span>
                    </div>
                    <p className="text-xs text-amber-700 mt-1 ml-7">
                        Will execute on Day {currentDay + 1} tick
                    </p>
                </div>
            )}

            {/* Actions Section */}
            <div className="mt-6 pt-4 border-t border-amber-300">
                <h3 className="text-lg font-semibold text-amber-900 mb-3" onClick={() => handleActionSubmit('MOVE blue_base')}>Actions</h3>
                {/* <MoveAction
                    player={player}
                    locations={allLocations}
                    onActionSubmit={handleActionSubmit}
                /> */}
            </div>
        </section>
    );
}
