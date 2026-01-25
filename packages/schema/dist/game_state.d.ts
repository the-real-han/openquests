import { LocationId, LocationState, LocationLog } from './location';
import { Player } from './player';
import { WorldLog } from './world_log';
export interface GameState {
    day: number;
    locations: Record<LocationId, LocationState>;
    players: Record<string, Player>;
    worldLog: WorldLog;
    locationLogs: Record<LocationId, LocationLog>;
}
export interface TickResult {
    newState: GameState;
    playerResults: Record<string, string>;
    narrativeSummary: string;
}
