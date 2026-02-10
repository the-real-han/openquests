import type { Player, LocationState, Clan } from '@openquests/schema';
import { usePendingAction } from '../hooks/usePendingAction';
import ActionButton from './ActionButton';
import { useState } from 'react';

interface PlayerPanelProps {
    player: Player;
    location: LocationState;
    locations: Record<string, LocationState>;
    currentDay: number;
    clan: Clan;
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

export default function PlayerPanel({ player, location, locations, currentDay, clan }: PlayerPanelProps) {
    const { pendingAction, setPendingAction } = usePendingAction(player.playerId, currentDay);
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const DEFAULT_BACKSTORY = `A ${player.character.class} of ${clan.name}, forged by hardship and resolve, ready to shape the fate of a changing world.`;

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
    const charClass = player.character.class;
    const runPng = runPngMap[charClass as keyof typeof runPngMap];
    const attackPng = attackPngMap[charClass as keyof typeof attackPngMap];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 md:gap-8 font-pixel text-amber-900">
            <div>
                <div className="relative">
                    <div className="relative">
                        <img src={`/assets/Player/info-top-black.png`} alt="OpenQuests Hero Info" className="w-full" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 text-white w-[42%]">
                            <p className="text-center">{clan.name}</p>
                        </div>
                    </div>
                    <div className="relative text-lg">
                        <img src={`/assets/Player/info-mid.png`} alt="OpenQuests Hero Info" className="w-full h[50%]" />
                        <div className='absolute pt-3 top-0 left-1/2 w-[40%] md:text-xl'>
                            <p className="w-full text-center no-wrap overflow-hidden text-ellipsis">{player.character.name}</p>
                            <div className='flex items-center justify-between'>
                                <p>Lv. {player.character.level}</p>
                                <div className="mb-1 bg-[url('/assets/Player/xp-bar.png')] bg-position-[center_center] bg-size-[100%_100%] w-[70%] leading-none h-[1lh] bg-no-repeat">
                                    <img src={`/assets/Player/xp-fill.png`} alt="OpenQuests XP Bar" className="h-full ml-4" style={{ width: `${Math.max(Math.floor(player.character.xp / ((player.character.level + 2) * (player.character.level + 2)) * 69), 2)}%` }} />
                                </div>
                            </div>
                            <div>
                                Title
                            </div>
                        </div>
                    </div>
                    <img src={`/assets/UI Elements/UI Elements/Human Avatars/Avatars_01.png`} alt="OpenQuests Hero" className="w-[45%] absolute right-1/2 top-0" />
                </div>
                <img src={`/assets/Player/backstory-top.png`} alt="OpenQuests Hero Info" className="w-full" />
                <div className="px-8 bg-[url('/assets/Player/backstory-mid.png')] bg-position-[center_top] bg-size-[100%_auto] bg-repeat-y">
                    <p className="text-center leading-none text-sm md:text-base"><em>"{player.character.backstory ? player.character.backstory : DEFAULT_BACKSTORY}"</em></p>
                </div>
                <img src={`/assets/Player/backstory-bot.png`} alt="OpenQuests Hero Info" className="w-full" />
            </div>
            <div>
                <div>
                    {location.clanId === player.character.clanId ? (
                        <div className={`relative ${isSubmitting ? 'opacity-60 blocking-cursor' : ''}`}>
                            <img src={`/assets/Player/action-4.png`} alt="OpenQuests Action" className="w-full" />
                            <div className={`absolute h-[50%] top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[100%] ${isSubmitting ? 'pointer-events-none ' : ''}`}>
                                <ActionButton player={player} action="GATHER" target="FOOD" pngSrc={`/assets/Units/${clan.id}/Pawn/Pawn_Run Meat.png`} onActionSubmit={handleActionSubmit} />
                                <ActionButton player={player} action="GATHER" target="WOOD" pngSrc={`/assets/Units/${clan.id}/Pawn/Pawn_Run Wood.png`} onActionSubmit={handleActionSubmit} />
                                <ActionButton player={player} action="GATHER" target="GOLD" pngSrc={`/assets/Units/${clan.id}/Pawn/Pawn_Run Gold.png`} onActionSubmit={handleActionSubmit} />
                                <ActionButton player={player} action="EXPLORE" target={location} pngSrc={`/assets/Units/${clan.id}/${classNormalizer(charClass)}/${runPng.name}`} pngProps={runPng} onActionSubmit={handleActionSubmit} />
                            </div>
                        </div>
                    ) : (
                        <div className={`relative ${isSubmitting ? 'opacity-50 blocking-cursor' : ''}`}>
                            <img src={`/assets/Player/action-2.png`} alt="OpenQuests Action" className="w-full" />
                            <div className={`absolute h-[50%] top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[100%] ${isSubmitting ? 'pointer-events-none ' : ''}`}>
                                <ActionButton player={player} action="EXPLORE" target={location} pngSrc={`/assets/Units/${clan.id}/${classNormalizer(charClass)}/${runPng.name}`} pngProps={runPng} onActionSubmit={handleActionSubmit} />
                                <ActionButton player={player} action="ATTACK" target={location} pngSrc={`/assets/Units/${clan.id}/${classNormalizer(charClass)}/${attackPng.name}`} pngProps={attackPng} onActionSubmit={handleActionSubmit} />
                            </div>
                        </div>
                    )}
                </div>
                <div>
                    <img src={`/assets/Log/log-player-top.png`} alt="OpenQuests Log" className="w-full" />
                    <div className="px-6 md:px-8 bg-[url('/assets/Log/log-player-mid.png')] bg-position-[center_top] bg-size-[100%_100%]">
                        {getPendingActionDisplay() && (
                            <p className="font-pixel text-center md:text-xl leading-[1.5] text-gray-400">⏳ {getPendingActionDisplay()}</p>
                        )}
                        <p className="font-pixel md:text-xl leading-[1.5] text-white">📜 DAY {log?.day}: {log?.action ? <span className="text-white">{log.action.type} [{log.action.type === "GATHER" ? log.action.target : locations[log.action.target ?? ""]?.name}]</span> : ""}</p>
                        <p className="font-pixel md:text-xl leading-none text-white" style={{ whiteSpace: 'pre-line' }}>{log?.summary}</p>
                    </div>
                    <img src={`/assets/Log/log-player-bot.png`} alt="OpenQuests Log" className="w-full" />
                </div>
            </div>
        </section>
    );
}
