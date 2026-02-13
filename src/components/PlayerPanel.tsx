import type { Player, LocationState, Clan, PlayerClass } from '@openquests/schema';
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
    if (className === "Adventurer") {
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
    "Adventurer": {
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
    "Adventurer": {
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

const getAvatarOffset = (clanId: string, charClass: PlayerClass) => {
    let offset = 1;
    switch (clanId) {
        case "emberwatch":
            offset = 6;
            break;
        case "sunherd":
            offset = 11;
            break;
        case "prismveil":
            offset = 16;
            break;
        case "shardveil":
            offset = 21;
            break;
        default:
            break;
    }
    switch (charClass) {
        case "Lancer":
            offset += 1;
            break;
        case "Archer":
            offset += 2;
            break;
        case "Monk":
            offset += 3;
            break;
        case "Adventurer":
            offset += 4;
            break;
        default:
            break;
    }
    return String(offset).padStart(2, '0');
}

const getAvatarWidth = (charClass: PlayerClass) => {
    switch (charClass) {
        case "Warrior":
            return "45%";
        default:
            return "50%";
    }
}

const chip = "inline-flex items-center pl-1 pr-1.5 py-0.5 rounded-lg text-xs font-semibold tracking-wide text-white relative overflow-hidden";

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

    const sortedTitles = player.character.titles.sort((a, b) => b.rank - a.rank);
    const topTitle = sortedTitles.at(0) ?? {
        "id": "new_guy",
        "title": "🎯 The Apprentice",
        "requirement": {
            "field": "meta.gatherFoodCount",
            "operator": ">=",
            "value": 0
        },
        "bonus": {
            "food": 0,
            "wood": 0,
            "gold": 0,
            "xp": 0,
            "fortune": 0
        },
        "rank": 1,
        "color": "#006c4b"
    };
    const secondTitle = sortedTitles.length > 1 ? sortedTitles.at(1) : null;

    const bonus = player.character.titles.reduce((acc, title) => {
        acc.food = Math.min(acc.food + title.bonus.food, 3);
        acc.wood = Math.min(acc.wood + title.bonus.wood, 3);
        acc.gold = Math.min(acc.gold + title.bonus.gold, 3);
        acc.xp = Math.min(acc.xp + title.bonus.xp, 3);
        acc.fortune = Math.min(acc.fortune + title.bonus.fortune, 3);
        return acc;
    }, {
        food: 0,
        wood: 0,
        gold: 0,
        xp: 0,
        fortune: 0
    });

    const log = player.history.at(-1);
    const charClass = player.character.class;
    const runPng = runPngMap[charClass as keyof typeof runPngMap];
    const attackPng = attackPngMap[charClass as keyof typeof attackPngMap];

    return (
        <section className="grid grid-cols-1 md:grid-cols-2 md:gap-8 font-pixel text-amber-900">
            <div className='md:w-full w-[90%] mx-auto'>
                <div className="relative">
                    <div className="relative">
                        <img src={`/assets/Player/info-top-${clan.id}.png`} alt="OpenQuests Hero Info" className="w-full" />
                        <div className="absolute top-1/2 left-1/2 transform -translate-y-1/2 text-white w-[42%]">
                            <p className="text-center">{clan.name}</p>
                        </div>
                    </div>
                    <div className="relative">
                        <img src={`/assets/Player/info-mid.png`} alt="OpenQuests Hero Info" className="w-full h[50%]" />
                        <div className='absolute pt-3 top-0 left-1/3 w-[65%] md:pl-6 md:pr-4 pl-4 pr-3'>
                            <div className="flex items-end justify-between mx-2">
                                <p className="w-[75%] text-left no-wrap leading-none overflow-hidden text-ellipsis md:text-2xl text-xl">{player.character.name}</p>
                                <p className="w-[20%] text-center leading-none">Lv{player.character.level}</p>
                            </div>
                            <div className="mb-1 bg-[url('/assets/Player/xp-bar.png')] bg-position-[center_center] bg-size-[120%_100%] w-full leading-none h-[1lh] bg-no-repeat">
                                <img src={`/assets/Player/xp-fill.png`} alt="OpenQuests XP Bar" className="h-full ml-4" style={{ width: `${Math.max(Math.floor(player.character.xp / ((player.character.level + 2) * (player.character.level + 2)) * 84), 2)}%` }} />
                            </div>
                            <div className="flex items-center justify-evenly md:text-sm text-xs">
                                <span className="flex items-center gap-1">
                                    <span className="text-[#5a4630]">🍀</span>
                                    <span className="text-[#5a4630]">+{bonus.fortune}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="text-[#5a4630]">✒️</span>
                                    <span className="text-[#5a4630]">+{bonus.xp}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="text-[#5a4630]">💰</span>
                                    <span className="text-[#5a4630]">+{bonus.gold}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="text-[#5a4630]">🥩</span>
                                    <span className="text-[#5a4630]">+{bonus.food}</span>
                                </span>
                                <span className="flex items-center gap-1">
                                    <span className="text-[#5a4630]">🪵</span>
                                    <span className="text-[#5a4630]">+{bonus.wood}</span>
                                </span>
                            </div>
                            <div className="flex items-center pt-1 justify-evenly">
                                <span className={`${chip} shadow-md shadow-black/50 ring-1`} style={{ backgroundColor: topTitle.color, '--tw-ring-color': topTitle.color + '55' } as React.CSSProperties}>{topTitle.title}</span>
                                {secondTitle && <span className={`${chip} shadow-md shadow-black/50 ring-1`} style={{ backgroundColor: secondTitle.color, '--tw-ring-color': secondTitle.color + '55' } as React.CSSProperties}>{secondTitle.title}</span>}
                            </div>
                        </div>
                    </div>
                    <img src={`/assets/UI Elements/UI Elements/Human Avatars/Avatars_${getAvatarOffset(clan.id, charClass)}.png`} alt="OpenQuests Hero" className="absolute right-7/12 top-0" style={{ width: getAvatarWidth(charClass) }} />
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
        </section >
    );
}
