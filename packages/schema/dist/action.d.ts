export interface Action {
    playerId: string;
    type: 'MOVE' | 'ATTACK' | 'WAIT';
    target?: string;
}
