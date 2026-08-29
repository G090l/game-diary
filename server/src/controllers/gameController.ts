import { Request, Response } from 'express';
import { getPool } from '../config/database';
import { Game } from '../models/Game';

export const gameController = {
    async getAllGames(req: Request, res: Response) {
        try {
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM games ORDER BY title');
            res.json(rows);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch games' });
        }
    },

    async getGameById(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pool = getPool();
            const [rows] = await pool.query('SELECT * FROM games WHERE id = ?', [id]);

            if ((rows as any[]).length === 0) {
                return res.status(404).json({ error: 'Game not found' });
            }

            res.json((rows as any[])[0]);
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch game' });
        }
    },

    async createGame(req: Request, res: Response) {
        try {
            const { title, genre, platform, developer, release_year } = req.body;
            const pool = getPool();

            const [result] = await pool.query(
                'INSERT INTO games (title, genre, platform, developer, release_year) VALUES (?, ?, ?, ?, ?)',
                [title, genre, platform, developer, release_year]
            );

            const [newGame] = await pool.query('SELECT * FROM games WHERE id = ?', [(result as any).insertId]);
            res.status(201).json((newGame as any[])[0]);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create game' });
        }
    },

    async updateGame(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const { title, genre, platform, developer, release_year } = req.body;
            const pool = getPool();

            await pool.query(
                'UPDATE games SET title = ?, genre = ?, platform = ?, developer = ?, release_year = ? WHERE id = ?',
                [title, genre, platform, developer, release_year, id]
            );

            const [updatedGame] = await pool.query('SELECT * FROM games WHERE id = ?', [id]);
            res.json((updatedGame as any[])[0]);
        } catch (error) {
            res.status(500).json({ error: 'Failed to update game' });
        }
    },

    async deleteGame(req: Request, res: Response) {
        try {
            const { id } = req.params;
            const pool = getPool();

            await pool.query('DELETE FROM games WHERE id = ?', [id]);
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete game' });
        }
    }
};