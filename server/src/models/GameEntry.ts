export interface GameEntry {
    id?: number;
    game_id: number;
    date: Date;
    time_spent: number;
    rating?: number;
    review?: string;
    status?: 'planned' | 'playing' | 'completed' | 'dropped';
    created_at?: Date;
    updated_at?: Date;
}