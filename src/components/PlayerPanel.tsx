import type { Player, LocationState } from '@openquests/schema';

interface PlayerPanelProps {
    player: Player;
    location: LocationState;
}

export default function PlayerPanel({ player, location }: PlayerPanelProps) {
    return (
        <section className="bg-gradient-to-br from-amber-100 to-amber-50 border-2 border-amber-600 rounded-lg p-6 mb-6 shadow-lg">
            <div className="flex items-center gap-3 mb-4">
                <span className="text-3xl">⚔️</span>
                <h2 className="text-2xl font-bold text-amber-900">Your Character</h2>
            </div>

            <div className="space-y-3 text-amber-900">
                <div className="flex items-center gap-2">
                    <span className="font-semibold">Adventurer:</span>
                    <span className="text-lg">{player.github.username}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-semibold">Class:</span>
                    <span className="bg-amber-200 px-3 py-1 rounded-full text-sm font-medium">
                        {player.character.class}
                    </span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-semibold">Current Location:</span>
                    <span>{location.name}</span>
                </div>

                <div className="flex items-center gap-2">
                    <span className="font-semibold">Status:</span>
                    <span className="text-green-700 font-medium">
                        {player.status.alive ? '✓ Healthy' : '💀 Deceased'}
                    </span>
                </div>
            </div>

            <div className="mt-6 pt-4 border-t border-amber-300">
                <p className="text-sm text-amber-800 italic">
                    Actions (coming soon)
                </p>
            </div>
        </section>
    );
}
