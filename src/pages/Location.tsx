import { useParams, Link } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useAuth, useCurrentPlayer } from '../contexts/AuthContext';
import type { ActionType, LocationState, PlayerClass } from '@openquests/schema';
import PlayerPanel from '../components/PlayerPanel';
import Header from '../components/Header';
import { TiledMapViewer } from '../components/Tilemap';


export default function Location() {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useGameState();
    const { isLoggedIn } = useAuth();
    const { currentPlayer } = useCurrentPlayer();
    /* {
        playerId: 1,
        github: {
            username: "Player1",
            issueNumber: 1,
            userId: 123456,
        },
        character: {
            clanId: "timberkeep",
            class: "Lancer" as PlayerClass,
            level: 1,
            xp: 9,
            name: "Player1",
            titles: ["Pioneer"],
            backstory: "At Pinewood Grove on Day 2, The Timberkeep saw their resources increase. Their wood reserves surged, growing by 15 units. A brave adventurer seeking glory in the realm of OpenQuests."
        },
        message: "You feel ready for adventure!",
        history: [
            {
                day: 1,
                action: {
                    type: "EXPLORE" as ActionType,
                    target: "forest"
                },
                summary: "You explore the forest and find a hidden path."
            },
            {
                day: 2,
                action: {
                    type: "ATTACK" as ActionType,
                    target: "wildrift"
                },
                summary: "You attack the monsters and kill them, over and over and over again."
            }
        ],
        meta: {
            joinedDay: 1,
            lastActionDay: 1,
            gatherFoodCount: 0,
            gatherWoodCount: 0,
            gatherGoldCount: 0,
            food: 10,
            wood: 5,
            gold: 100,
            exploreCount: 0,
            attackCount: 0,
            playerWins: 0,
            playerLosses: 0,
            monsterKilled: 0,
            bossKilled: 0,
            monsterEncountered: 0,
            attackWinStreak: 0,
            attackLoseStreak: 0,
            attackedCount: 0,
        }
    } */

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
    const clan = data.clans[location.clanId];
    const locationLog = location.history.at(-1);


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
                        locations={data.locations}
                        clan={data.clans[currentPlayer.character.clanId]}
                        currentDay={data.day}
                    />
                )}
            </main>
        </div>
    );
}
