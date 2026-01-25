export type LocationId = string;
export type LocationName = string; // Alias

export interface LocationState {
    id: LocationId;
    name: string;
    description: string;
    exits: LocationId[];
}

export interface LocationLog {
    day: number;
    summary: string;
    population: number;
    notes?: string[];
}
