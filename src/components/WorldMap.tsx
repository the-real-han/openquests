import type { LocationState, LocationLog } from '@openquests/schema';

interface WorldMapProps {
    locations: Record<string, LocationState>;
    locationLogs: Record<string, LocationLog>;
    onLocationClick: (locationId: string) => void;
}

// Hardcoded positions for each location (static geography)
const LOCATION_POSITIONS: Record<string, { x: number; y: number }> = {
    'pinewood-grove': { x: 250, y: 200 },
    'goldforge-mine': { x: 550, y: 200 },
    'harmony-fields': { x: 250, y: 300 },
    'golden-plains': { x: 550, y: 300 },
    'twilight-pits': { x: 250, y: 250 },
    'wildrift': { x: 450, y: 200 }
};

export default function WorldMap({ locations, locationLogs, onLocationClick }: WorldMapProps) {
    // Extract unique connections from exits to avoid duplicate lines
    const getUniqueConnections = (): Array<[string, string]> => {
        const connections = new Set<string>();

        Object.entries(locations).forEach(([fromId, _]) => {
            Object.entries(locations).forEach(([toId, _]) => {
                // Create a sorted pair to avoid duplicates (A-B same as B-A)
                if (fromId !== toId) {
                    const pair = [fromId, toId].sort();
                    const key = `${pair[0]}-${pair[1]}`;
                    connections.add(key);
                }
            });
        });

        return Array.from(connections).map(key => {
            const [a, b] = key.split('-');
            return [a, b];
        });
    };



    const connections = getUniqueConnections();

    return (
        <svg
            viewBox="0 0 800 400"
            className="w-full h-auto bg-amber-50 rounded-lg border-2 border-amber-900/20 shadow-lg"
            style={{ maxHeight: '500px' }}
        >
            {/* Parchment texture background */}
            <defs>
                <pattern id="parchment" x="0" y="0" width="100" height="100" patternUnits="userSpaceOnUse">
                    <rect width="100" height="100" fill="#fef3c7" />
                </pattern>
            </defs>
            <rect width="800" height="400" fill="url(#parchment)" />

            {/* Render connection lines behind markers */}
            <g className="connections">
                {connections.map(([fromId, toId]) => {
                    const fromPos = LOCATION_POSITIONS[fromId];
                    const toPos = LOCATION_POSITIONS[toId];

                    if (!fromPos || !toPos) return null;

                    return (
                        <line
                            key={`${fromId}-${toId}`}
                            x1={fromPos.x}
                            y1={fromPos.y}
                            x2={toPos.x}
                            y2={toPos.y}
                            stroke="#78350f"
                            strokeWidth="2"
                            strokeOpacity="0.3"
                            strokeDasharray="5,3"
                        />
                    );
                })}
            </g>

            {/* Render location markers */}
            <g className="markers">
                {Object.entries(locations).map(([locationId, location]) => {
                    const pos = LOCATION_POSITIONS[locationId];
                    const log = locationLogs[locationId];
                    const population = log?.population ?? 0;

                    if (!pos) return null;

                    return (
                        <g
                            key={locationId}
                            transform={`translate(${pos.x}, ${pos.y})`}
                            onClick={() => onLocationClick(locationId)}
                            className="cursor-pointer transition-transform hover:scale-110"
                            style={{ transformOrigin: 'center' }}
                        >
                            {/* Tooltip on hover */}
                            <title>{location.name}</title>

                            {/* Marker circle */}
                            <circle
                                r="30"
                                fill="#f59e0b"
                                stroke="#78350f"
                                strokeWidth="3"
                                className="transition-all hover:fill-amber-500"
                            />

                            {/* Location icon (castle tower) */}
                            <text
                                textAnchor="middle"
                                dominantBaseline="middle"
                                fontSize="20"
                                fill="#78350f"
                            >
                                🏰
                            </text>

                            {/* Location name */}
                            <text
                                y="50"
                                textAnchor="middle"
                                fontSize="14"
                                fontWeight="bold"
                                fill="#78350f"
                                className="pointer-events-none select-none"
                            >
                                {location.name}
                            </text>

                            {/* Population count */}
                            <text
                                y="68"
                                textAnchor="middle"
                                fontSize="12"
                                fill="#92400e"
                                className="pointer-events-none select-none"
                            >
                                👥 {population}
                            </text>
                        </g>
                    );
                })}
            </g>
        </svg>
    );
}
