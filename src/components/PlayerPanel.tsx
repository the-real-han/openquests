import type { Player, LocationState } from '@openquests/schema';
import { usePendingAction } from '../hooks/usePendingAction';
import { Sprite } from './Sprite';
import ActionButton from './ActionButton';
import { useState } from 'react';

interface PlayerPanelProps {
    player: Player;
    location: LocationState;
    locations: Record<string, LocationState>;
    currentDay: number;
}

const classNormalizer = (className: string) => {
    if (className === "Advanturer") {
        return "Pawn";
    }
    return className;
}

const attackPngMap = {
    "Warrior": {
        name: "Warrior_Attack1.png",
        frames: 4,
        size: 192,
        crop: .7
    },
    "Advanturer": {
        name: "Pawn_Interact Knife.png",
        frames: 4,
        size: 192,
        crop: .7
    },
    "Monk": {
        name: "Heal.png",
        frames: 11,
        size: 192,
        crop: .7
    },
    "Lancer": {
        name: "Lancer_Right_Attack.png",
        frames: 3,
        size: 320,
        crop: .4
    },
    "Archer": {
        name: "Archer_Shoot.png",
        frames: 8,
        size: 192,
        crop: .7
    }
}

const runPngMap = {
    "Warrior": {
        name: "Warrior_Run.png",
        frames: 6,
        size: 192,
        crop: .7
    },
    "Advanturer": {
        name: "Pawn_Run.png",
        frames: 6,
        size: 192,
        crop: .7
    },
    "Monk": {
        name: "Run.png",
        frames: 4,
        size: 192,
        crop: .7
    },
    "Lancer": {
        name: "Lancer_Run.png",
        frames: 6,
        size: 320,
        crop: .4
    },
    "Archer": {
        name: "Archer_Run.png",
        frames: 4,
        size: 192,
        crop: .7
    }
}

export default function PlayerPanel({ player, location, locations, currentDay }: PlayerPanelProps) {
    const { pendingAction, setPendingAction } = usePendingAction(player.playerId, currentDay);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleActionSubmit = (action: string, feedback: string) => {
        action && setPendingAction(action);
        feedback && setFeedback(feedback);
        setIsSubmitting(true);
        setTimeout(() => {
            setIsSubmitting(false);
        }, 2000);
    };

    const getPendingActionDisplay = () => {
        if (!feedback && !pendingAction) return null;
        return feedback || pendingAction;
    };

    const log = player.history.at(-1);
    const clanId = player.character.clanId;
    const charClass = player.character.class;
    const runPng = runPngMap[charClass as keyof typeof runPngMap];
    const attackPng = attackPngMap[charClass as keyof typeof attackPngMap];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2">
            <div>
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
                            {charClass}
                        </span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="font-semibold">Home:</span>
                        <span>{location.name}</span>
                    </div>
                </div>
            </div>
            <div>
                <div>
                    <img src={`/assets/Log/log-player-top.png`} alt="OpenQuests Log" className="w-full" />
                    <div className="px-4 md:px-6 bg-[url('/assets/Log/log-player-mid.png')] bg-position-[center_top] bg-size-[100%_100%]">
                        {getPendingActionDisplay() && (
                            <p className="font-pixel text-center md:text-xl leading-[1.5] text-gray-400">⏳ {getPendingActionDisplay()}</p>
                        )}
                        <p className="font-pixel md:text-xl leading-none text-white">DAY {log?.day}: <span className="text-white">{log?.action?.type} [{locations[log?.action?.target ?? ""]?.name}]</span></p>
                        <p className="font-pixel md:text-xl leading-none text-white" style={{ whiteSpace: 'pre-line' }}>{log?.summary}</p>
                    </div>
                    <img src={`/assets/Log/log-player-bot.png`} alt="OpenQuests Log" className="w-full" />
                </div>
                <div>
                    {location.clanId === player.character.clanId ? (
                        <div className={`relative ${isSubmitting ? 'opacity-60 blocking-cursor' : ''}`}>
                            <img src={`/assets/Player/action-4.png`} alt="OpenQuests Action" className="w-full" />
                            <div className={`absolute h-[50%] top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[100%] ${isSubmitting ? 'pointer-events-none ' : ''}`}>
                                <ActionButton player={player} action="GATHER" target="FOOD" pngSrc={`/assets/Units/${clanId}/Pawn/Pawn_Run Meat.png`} onActionSubmit={handleActionSubmit} />
                                <ActionButton player={player} action="GATHER" target="WOOD" pngSrc={`/assets/Units/${clanId}/Pawn/Pawn_Run Wood.png`} onActionSubmit={handleActionSubmit} />
                                <ActionButton player={player} action="GATHER" target="GOLD" pngSrc={`/assets/Units/${clanId}/Pawn/Pawn_Run Gold.png`} onActionSubmit={handleActionSubmit} />
                                <ActionButton player={player} action="EXPLORE" target={location} pngSrc={`/assets/Units/${clanId}/${classNormalizer(charClass)}/${runPng.name}`} pngProps={runPng} onActionSubmit={handleActionSubmit} />
                            </div>
                        </div>
                    ) : (
                        <div className={`relative ${isSubmitting ? 'opacity-50 blocking-cursor' : ''}`}>
                            <img src={`/assets/Player/action-2.png`} alt="OpenQuests Action" className="w-full" />
                            <div className={`absolute h-[50%] top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[100%] ${isSubmitting ? 'pointer-events-none ' : ''}`}>
                                <ActionButton player={player} action="EXPLORE" target={location} pngSrc={`/assets/Units/${clanId}/${classNormalizer(charClass)}/${runPng.name}`} pngProps={runPng} onActionSubmit={handleActionSubmit} />
                                <ActionButton player={player} action="ATTACK" target={location} pngSrc={`/assets/Units/${clanId}/${classNormalizer(charClass)}/${attackPng.name}`} pngProps={attackPng} onActionSubmit={handleActionSubmit} />
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
}
