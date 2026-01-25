export declare const PLAYER_CLASSES: readonly ["Warrior", "Lancer", "Archer", "Monk", "Adventurer"];
export type PlayerClass = typeof PLAYER_CLASSES[number];
export interface Player {
    playerId: number;
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
    location: string;
    status: {
        alive: boolean;
    };
    meta: {
        joinedDay: number;
        lastActionDay: number;
    };
}
