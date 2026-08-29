"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.gameController = void 0;
const database_1 = require("../config/database");
exports.gameController = {
    async getAllGames(req, res) {
        try {
            const pool = (0, database_1.getPool)();
            const [rows] = await pool.query('SELECT * FROM games ORDER BY title');
            res.json(rows);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch games' });
        }
    },
    async getGameById(req, res) {
        try {
            const { id } = req.params;
            const pool = (0, database_1.getPool)();
            const [rows] = await pool.query('SELECT * FROM games WHERE id = ?', [id]);
            if (rows.length === 0) {
                return res.status(404).json({ error: 'Game not found' });
            }
            res.json(rows[0]);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch game' });
        }
    },
    async createGame(req, res) {
        try {
            const { title, genre, platform, developer, release_year } = req.body;
            const pool = (0, database_1.getPool)();
            const [result] = await pool.query('INSERT INTO games (title, genre, platform, developer, release_year) VALUES (?, ?, ?, ?, ?)', [title, genre, platform, developer, release_year]);
            const [newGame] = await pool.query('SELECT * FROM games WHERE id = ?', [result.insertId]);
            res.status(201).json(newGame[0]);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create game' });
        }
    },
    async updateGame(req, res) {
        try {
            const { id } = req.params;
            const { title, genre, platform, developer, release_year } = req.body;
            const pool = (0, database_1.getPool)();
            await pool.query('UPDATE games SET title = ?, genre = ?, platform = ?, developer = ?, release_year = ? WHERE id = ?', [title, genre, platform, developer, release_year, id]);
            const [updatedGame] = await pool.query('SELECT * FROM games WHERE id = ?', [id]);
            res.json(updatedGame[0]);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update game' });
        }
    },
    async deleteGame(req, res) {
        try {
            const { id } = req.params;
            const pool = (0, database_1.getPool)();
            await pool.query('DELETE FROM games WHERE id = ?', [id]);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete game' });
        }
    }
};
