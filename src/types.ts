import { PlayerClass } from './classes';


export type LocationId = string;
export type LocationName = string; // Alias

// The minimal state required to persist the world
export interface GameState {
    day: number;
    locations: Record<LocationId, LocationState>;
    players: Record<string, Player>;
    worldLog: WorldLog;
    locationLogs: Record<LocationId, LocationLog>;
}

export interface WorldLog {
    day: number;
    summary: string;
    population: number;
    notes?: string[];
}

export interface LocationLog {
    day: number;
    summary: string;
    population: number;
    notes?: string[];
}

export interface LocationState {
    id: LocationId;
    name: string;
    description: string;
    exits: LocationId[];
}

// A player in the system
export interface Player {
    playerId: number; // Issue Number
    github: {
        username: string;
        issueNumber: number;
        userId: number;
    };
    character: {
        name: string;
        class: PlayerClass;
        title: string;
        backstory: string;
    };
    location: LocationName;
    status: {
        alive: boolean;
    };
    meta: {
        joinedDay: number;
        lastActionDay: number;
    };
}

// An action submitted by a player
export interface Action {
    playerId: string;
    type: 'MOVE' | 'ATTACK' | 'WAIT';
    target?: string; // e.g., "forest", "goblin"
}

// Result of a processed daily tick
export interface TickResult {
    newState: GameState;
    playerResults: Record<string, string>; // playerId -> message
    narrativeSummary: string;
}
