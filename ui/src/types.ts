export interface Location {
    id: string;
    name: string;
    description: string;
    exits: string[];
}

export interface LocationLog {
    day: number;
    summary: string;
    population: number;
    notes: string[];
}

export interface WorldLog {
    day: number;
    summary: string;
    population: number;
    notes: string[];
}

export interface Player {
    playerId: number;
    github: {
        username: string;
        issueNumber: number;
        userId: number;
    };
    character: {
        name: string;
        class: string;
        title: string;
        backstory: string;
    };
    location: string;
    status: {
        alive: boolean;
    };
    meta: {
        joinedDay: number;
        lastActionDay: number;
    };
}

export interface GameState {
    day: number;
    locations: Record<string, Location>;
    locationLogs: Record<string, LocationLog>;
    players: Record<string, Player>;
    worldLog: WorldLog;
}
