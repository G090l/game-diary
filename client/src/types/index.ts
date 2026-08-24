export interface Game {
    id: number;
    title: string;
    genre: string;
    platform: string;
    developer: string;
    release_year: number;
    created_at: string;
    updated_at: string;
}

export interface GameEntry {
    id: number;
    game_id: number;
    game_title?: string;
    date: string;
    time_spent: number;
    rating: number | null;
    review: string;
    status: 'planned' | 'playing' | 'completed' | 'dropped';
    created_at: string;
    updated_at: string;
}

export interface Stats {
    total_games: number;
    total_entries: number;
    total_time: number;
    avg_rating: number | string | null; // Может быть null или строкой
    status_stats: {
        status: string;
        count: number;
    }[];
}

export interface GameFormData {
    title: string;
    genre: string;
    platform: string;
    developer: string;
    release_year: number;
}

export interface EntryFormData {
    game_id: number;
    date: string;
    time_spent: number;
    rating: number | null;
    review: string;
    status: 'planned' | 'playing' | 'completed' | 'dropped';
}