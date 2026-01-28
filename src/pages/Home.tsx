import { useGameState } from '../hooks/useGameState';
import WorldMap from '../components/WorldMap';
import Header from '../components/Header';

export default function Home() {
    const { data, loading, error } = useGameState();

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
            <Header />

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
