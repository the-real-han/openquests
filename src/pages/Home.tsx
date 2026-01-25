import { useGameState } from '../hooks/useGameState';
import { useAuth } from '../contexts/AuthContext';
import WorldMap from '../components/WorldMap';
import AvatarMenu from '../components/AvatarMenu';

export default function Home() {
    const { data, loading, error } = useGameState();
    const { isLoggedIn, login } = useAuth();

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

    // Format world log summary to preserve line breaks and markdown-style headings
    const formatWorldLog = (summary: string) => {
        return summary.split('\n').map((line, index) => {
            if (line.startsWith('###')) {
                const heading = line.replace('###', '').trim();
                return <h3 key={index} className="text-lg font-bold mt-3 mb-1">{heading}</h3>;
            } else if (line === '---') {
                return <hr key={index} className="my-2 border-amber-700" />;
            } else if (line.trim()) {
                return <p key={index} className="mb-1">{line}</p>;
            }
            return <br key={index} />;
        });
    };

    const handleLocationClick = (locationId: string) => {
        window.location.hash = `#/location/${locationId}`;
    };

    return (
        <div className="min-h-screen bg-slate-900 text-white">
            <header className="bg-slate-800 p-4 shadow-lg">
                <div className="container mx-auto flex justify-between items-center">
                    <h1 className="text-2xl font-bold">OpenQuests</h1>
                    <div className="flex items-center gap-4">
                        <span className="bg-slate-700 px-3 py-1 rounded-full text-sm">Day {data.worldLog.day}</span>
                        {isLoggedIn ? (
                            <AvatarMenu />
                        ) : (
                            <button
                                onClick={login}
                                className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-lg text-sm font-medium transition flex items-center gap-2"
                            >
                                <span>🔐</span>
                                <span>Login with GitHub</span>
                            </button>
                        )}
                    </div>
                </div>
            </header>

            <main className="container mx-auto p-4">
                <section className="bg-amber-50 text-amber-900 p-6 rounded-lg my-6">
                    <h2 className="text-xl font-serif mb-3 text-center">📜 World Log</h2>
                    <div className="text-left">
                        {formatWorldLog(data.worldLog.summary)}
                    </div>
                </section>

                <section className="my-6">
                    <h3 className="text-xl mb-4 text-center">The Known World</h3>
                    <WorldMap
                        locations={data.locations}
                        locationLogs={data.locationLogs}
                        onLocationClick={handleLocationClick}
                    />
                </section>
            </main>
        </div>
    );
}
