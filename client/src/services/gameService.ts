import { api } from './api';
import { Game } from '../types';

export const gameService = {
    getAll: () => api.get<Game[]>('/games'),
    getById: (id: number) => api.get<Game>(`/games/${id}`),
    create: (data: Omit<Game, 'id' | 'created_at' | 'updated_at'>) =>
        api.post<Game>('/games', data),
    update: (id: number, data: Partial<Game>) =>
        api.put<Game>(`/games/${id}`, data),
    delete: (id: number) => api.delete(`/games/${id}`),
};