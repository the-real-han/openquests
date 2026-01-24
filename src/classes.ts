export const PLAYER_CLASSES = [
    'Warrior',
    'Mage',
    'Rogue',
    'Blacksmith',
    'Adventurer'
] as const;

export type PlayerClass = typeof PLAYER_CLASSES[number];
