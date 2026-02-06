import { useParams, Link } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useAuth, useCurrentPlayer } from '../contexts/AuthContext';
import type { LocationState } from '@openquests/schema';
import PlayerPanel from '../components/PlayerPanel';
import Header from '../components/Header';
import { TiledMapViewer } from '../components/Tilemap';
import { Sprite } from '../components/Sprite';


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


export default function Location() {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useGameState();
    const { isLoggedIn } = useAuth();
    const currentPlayer = {
        character: {
            clanId: "timberkeep",
            class: "Lancer",
            level: 1,
            xp: 0,
            name: "Player1",
        }
    } //useCurrentPlayer();

    const formatNumberShorthand = (num: number) => {
        if (num < 1000) {
            return num.toString();
        }

        if (num < 1000000) {
            const thousands = num / 1000;
            // Show decimal for numbers under 10k, whole number for 10k+
            return thousands < 10
                ? `${thousands.toFixed(1)}k`
                : `${Math.round(thousands)}k`;
        }

        if (num < 1000000000) {
            const millions = num / 1000000;
            // Show decimal for numbers under 10m, whole number for 10m+
            return millions < 10
                ? `${millions.toFixed(1)}m`
                : `${Math.round(millions)}m`;
        }

        const billions = num / 1000000000;
        // Show decimal for numbers under 10b, whole number for 10b+
        return billions < 10
            ? `${billions.toFixed(1)}b`
            : `${Math.round(billions)}b`;
    }


    if (loading) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p className="text-xl">Loading game state...</p>
            </div>
        );
    }

    if (error || !data) {
        return (
            <div className="min-h-screen bg-slate-900 text-white flex items-center justify-center">
                <p className="text-xl text-red-400">Error: {error || 'Failed to load game state'}</p>
            </div>
        );
    }

    const location = id ? data.locations[id] : null;
    const locationLog = id ? data.locationLogs[id] : null;
    const clan = location ? data.clans[location.clanId] : null;

    if (!location) {
        return (
            <div className="min-h-screen bg-slate-900 text-white">
                <header className="bg-slate-800 p-4 shadow-lg">
                    <div className="container mx-auto">
                        <Link to="/" className="text-blue-400 hover:underline">← Back to World Map</Link>
                    </div>
                </header>
                <main className="container mx-auto p-4">
                    <p className="text-xl text-red-400">Location not found: {id}</p>
                </main>
            </div>
        );
    }

    // Check if player should see their panel here
    const showPlayerPanel = isLoggedIn && currentPlayer;

    return (
        <div className="min-h-screen bg-[#47aba9] text-white bg-[url('/assets/bg.png')] bg-repeat-y bg-[position:50%_0]">
            <Header />

            <main className="container mx-auto max-w-3xl p-4">
                <div className="md:w-[70%] w-[90%] mx-auto relative">
                    <Link to="/"><img src={`/assets/UI Elements/UI Elements/Icons/Icon_08.png`} alt="OpenQuests Log" className="absolute md:top-2 md:right-6 right-4 md:h-10 md:w-15 h-7 w-10 scale-x-[-1]" /></Link>
                    <img src={`/assets/Log/log-${location.id}.png`} alt="OpenQuests Log" className="w-full" />
                    <div className="px-8 md:px-12 flex justify-center bg-[url('/assets/Log/log-mid.png')] bg-position-[center_top] bg-size-[100%_100%]">
                        <p className="text-center font-pixel md:text-xl leading-none text-amber-900">{locationLog ? locationLog.summary : location.description}</p>
                    </div>
                    {location.clanId === "monsters" ? (
                        <img src={`/assets/Log/log-bot.png`} alt="OpenQuests Log" className="w-full" />
                    ) : (
                        <div className='relative'>
                            <img src={`/assets/Log/log-bot-${location.id}.png`} alt="OpenQuests Log" className="w-full" />
                            <div className="absolute bottom-0 h-[66%] w-[80%] left-[50%] -translate-x-1/2 flex justify-around items-center">
                                <p className="font-pixel md:text-xl leading-none text-white pt-1">{clan?.name}</p>
                                <div className="flex items-center justify-between h-[100%] w-[15%]">
                                    <img src={`/assets/UI Elements/UI Elements/Human Avatars/Avatars_25.png`} alt="OpenQuests Resources" className="h-[70%]" />
                                    <p className="font-pixel md:text-lg text-xs leading-none text-white pt-1">{Object.values(data.players).filter(player => player.character.clanId === location.clanId).length}</p>
                                </div>
                                <div className="flex items-center justify-between h-[100%] w-[15%]">
                                    <img src={`/assets/UI Elements/UI Elements/Icons/Icon_03.png`} alt="OpenQuests Resources" className="h-[50%]" />
                                    <p className="font-pixel md:text-lg text-xs leading-none text-white pt-1">{formatNumberShorthand(clan?.gold ?? 0)}</p>
                                </div>
                                <div className="flex items-center justify-between h-[100%] w-[15%]">
                                    <img src={`/assets/UI Elements/UI Elements/Icons/Icon_04.png`} alt="OpenQuests Resources" className="h-[50%]" />
                                    <p className="font-pixel md:text-lg text-xs leading-none text-white pt-1">{formatNumberShorthand(clan?.food ?? 0)}</p>
                                </div>
                                <div className="flex items-center justify-between h-[100%] w-[15%]">
                                    <img src={`/assets/UI Elements/UI Elements/Icons/Icon_02.png`} alt="OpenQuests Resources" className="h-[50%]" />
                                    <p className="font-pixel md:text-lg text-xs leading-none text-white pt-1">{formatNumberShorthand(clan?.wood ?? 0)}</p>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
                <TiledMapViewer jsonPath="map/village.json" />

                {showPlayerPanel && (
                    <PlayerPanel
                        player={currentPlayer}
                        location={location as LocationState}
                        allLocations={data.locations}
                        currentDay={data.worldLog.day}
                    />
                )}

                <div className="grid grid-cols-1 md:grid-cols-2">
                    <div>Left Column (stacks on mobile)</div>
                    <div>
                        <div>
                            <img src={`/assets/Log/log-player-top.png`} alt="OpenQuests Log" className="w-full" />
                            <div className="px-4 md:px-6 bg-[url('/assets/Log/log-player-mid.png')] bg-position-[center_top] bg-size-[100%_100%]">
                                <p className="font-pixel md:text-xl leading-none text-white">DAY {data.day}: <span className="text-gray-400">ATTACK</span></p>
                                <p className="font-pixel md:text-xl leading-none text-white">{currentPlayer?.message}</p>
                            </div>
                            <img src={`/assets/Log/log-player-bot.png`} alt="OpenQuests Log" className="w-full" />
                        </div>
                        <div>
                            {location.clanId === currentPlayer?.character.clanId ? (
                                <div className="relative">
                                    <img src={`/assets/Player/action-4.png`} alt="OpenQuests Action" className="w-full" />
                                    <div className="absolute h-[50%] top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[100%]">
                                        <Sprite src={`/assets/Units/${currentPlayer?.character.clanId}/Pawn/Pawn_Run Meat.png`} />
                                        <Sprite src={`/assets/Units/${currentPlayer?.character.clanId}/Pawn/Pawn_Run Gold.png`} />
                                        <Sprite src={`/assets/Units/${currentPlayer?.character.clanId}/Pawn/Pawn_Run Wood.png`} />
                                        <Sprite src={`/assets/Units/${currentPlayer?.character.clanId}/${classNormalizer(currentPlayer?.character.class)}/${runPngMap[currentPlayer?.character.class as keyof typeof runPngMap].name}`} framesize={runPngMap[currentPlayer?.character.class as keyof typeof runPngMap].size} frames={runPngMap[currentPlayer?.character.class as keyof typeof runPngMap].frames} cropRatio={runPngMap[currentPlayer?.character.class as keyof typeof runPngMap].crop} />
                                    </div>
                                </div>
                            ) : (
                                <div className="relative">
                                    <img src={`/assets/Player/action-2.png`} alt="OpenQuests Action" className="w-full" />
                                    <div className="absolute h-[50%] top-1/2 transform -translate-y-1/2 flex items-center justify-center w-[100%]">
                                        <Sprite src={`/assets/Units/${currentPlayer?.character.clanId}/${classNormalizer(currentPlayer?.character.class)}/${runPngMap[currentPlayer?.character.class as keyof typeof runPngMap].name}`} framesize={runPngMap[currentPlayer?.character.class as keyof typeof runPngMap].size} frames={runPngMap[currentPlayer?.character.class as keyof typeof runPngMap].frames} cropRatio={runPngMap[currentPlayer?.character.class as keyof typeof runPngMap].crop} />
                                        <Sprite src={`/assets/Units/${currentPlayer?.character.clanId}/${classNormalizer(currentPlayer?.character.class)}/${attackPngMap[currentPlayer?.character.class as keyof typeof attackPngMap].name}`} framesize={attackPngMap[currentPlayer?.character.class as keyof typeof attackPngMap].size} frames={attackPngMap[currentPlayer?.character.class as keyof typeof attackPngMap].frames} cropRatio={attackPngMap[currentPlayer?.character.class as keyof typeof attackPngMap].crop} />
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
}
