export interface Game {
    id?: number;
    title: string;
    genre?: string;
    platform?: string;
    developer?: string;
    release_year?: number;
    created_at?: Date;
    updated_at?: Date;
}