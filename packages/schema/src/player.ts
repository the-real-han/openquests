export const PLAYER_CLASSES = [
    'Warrior',
    'Lancer',
    'Archer',
    'Monk',
    'Adventurer'
] as const;

export type PlayerClass = typeof PLAYER_CLASSES[number];

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
    location: string; // LocationId/LocationName
    status: {
        alive: boolean;
    };
    meta: {
        joinedDay: number;
        lastActionDay: number;
    };
}
