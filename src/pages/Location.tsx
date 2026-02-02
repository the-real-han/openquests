import { useParams, Link } from 'react-router-dom';
import { useGameState } from '../hooks/useGameState';
import { useAuth, useCurrentPlayer } from '../contexts/AuthContext';
import type { LocationState } from '@openquests/schema';
import PlayerPanel from '../components/PlayerPanel';
import Header from '../components/Header';
import { TiledMapViewer } from '../components/Tilemap';

export default function Location() {
    const { id } = useParams<{ id: string }>();
    const { data, loading, error } = useGameState();
    const { isLoggedIn } = useAuth();
    const { currentPlayer } = useCurrentPlayer();

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
    const showPlayerPanel = isLoggedIn && currentPlayer && currentPlayer.character.clanId === location.clanId;

    return (
        <div className="min-h-screen bg-[#47aba9] text-white bg-[url('assets/bg.png')] bg-repeat-y bg-[position:50%_0]">
            <Header />

            <main className="container mx-auto max-w-4xl p-4">
                <h1 className="text-3xl font-bold mb-2">{location.name}</h1>
                <p className="text-slate-400 italic mb-6">{location.description}</p>

                <TiledMapViewer jsonPath="map/village.json" />

                {showPlayerPanel && currentPlayer && (
                    <PlayerPanel
                        player={currentPlayer}
                        location={location as LocationState}
                        allLocations={data.locations}
                        currentDay={data.worldLog.day}
                    />
                )}

                {locationLog && (
                    <section className="bg-amber-50 text-amber-900 p-4 rounded-lg mb-6">
                        <h3 className="font-semibold mb-2">Day {locationLog.day} Log</h3>
                        <p className="mb-2">{locationLog.summary}</p>
                        <p className="text-sm">
                            Population: <strong>{locationLog.population}</strong> {locationLog.population === 1 ? 'adventurer' : 'adventurers'}
                        </p>
                    </section>
                )}
            </main>
        </div>
    );
}
