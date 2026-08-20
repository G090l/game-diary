import { api } from './api';
import { GameEntry } from '../types';

export const entryService = {
    getAll: () => api.get<GameEntry[]>('/entries'),
    getByGame: (gameId: number) => api.get<GameEntry[]>(`/entries/game/${gameId}`),
    create: (data: Omit<GameEntry, 'id' | 'created_at' | 'updated_at'>) =>
        api.post<GameEntry>('/entries', data),
    update: (id: number, data: Partial<GameEntry>) =>
        api.put<GameEntry>(`/entries/${id}`, data),
    delete: (id: number) => api.delete(`/entries/${id}`),
    getStats: () => api.get('/entries/stats'),
};