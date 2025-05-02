export interface Character {
    id: number;
    name: string;
    image: string;
    votes: number;
}

export interface Combat {
    id: number;
    characters: [Character, Character];
}

