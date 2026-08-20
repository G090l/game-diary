"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.entryController = void 0;
const database_1 = require("../config/database");
exports.entryController = {
    // Получить все записи
    async getAllEntries(req, res) {
        try {
            const pool = (0, database_1.getPool)();
            const [rows] = await pool.query(`
        SELECT e.*, g.title as game_title 
        FROM game_entries e 
        JOIN games g ON e.game_id = g.id 
        ORDER BY e.date DESC
      `);
            res.json(rows);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch entries' });
        }
    },
    // Получить записи для конкретной игры
    async getEntriesByGame(req, res) {
        try {
            const { gameId } = req.params;
            const pool = (0, database_1.getPool)();
            const [rows] = await pool.query('SELECT * FROM game_entries WHERE game_id = ? ORDER BY date DESC', [gameId]);
            res.json(rows);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch entries' });
        }
    },
    // Создать запись
    async createEntry(req, res) {
        try {
            const { game_id, date, time_spent, rating, review, status } = req.body;
            const pool = (0, database_1.getPool)();
            const [result] = await pool.query(`INSERT INTO game_entries (game_id, date, time_spent, rating, review, status) 
         VALUES (?, ?, ?, ?, ?, ?)`, [game_id, date, time_spent, rating, review, status]);
            const [newEntry] = await pool.query('SELECT * FROM game_entries WHERE id = ?', [result.insertId]);
            res.status(201).json(newEntry[0]);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to create entry' });
        }
    },
    // Обновить запись
    async updateEntry(req, res) {
        try {
            const { id } = req.params;
            const { game_id, date, time_spent, rating, review, status } = req.body;
            const pool = (0, database_1.getPool)();
            await pool.query(`UPDATE game_entries SET game_id = ?, date = ?, time_spent = ?, rating = ?, review = ?, status = ? 
         WHERE id = ?`, [game_id, date, time_spent, rating, review, status, id]);
            const [updatedEntry] = await pool.query('SELECT * FROM game_entries WHERE id = ?', [id]);
            res.json(updatedEntry[0]);
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to update entry' });
        }
    },
    // Удалить запись
    async deleteEntry(req, res) {
        try {
            const { id } = req.params;
            const pool = (0, database_1.getPool)();
            await pool.query('DELETE FROM game_entries WHERE id = ?', [id]);
            res.status(204).send();
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to delete entry' });
        }
    },
    // Получить статистику
    async getStats(req, res) {
        try {
            const pool = (0, database_1.getPool)();
            // Общая статистика
            const [totalGames] = await pool.query('SELECT COUNT(*) as total FROM games');
            const [totalEntries] = await pool.query('SELECT COUNT(*) as total FROM game_entries');
            const [totalTime] = await pool.query('SELECT SUM(time_spent) as total FROM game_entries');
            const [avgRating] = await pool.query('SELECT AVG(rating) as avg FROM game_entries WHERE rating IS NOT NULL');
            // Статистика по статусам
            const [statusStats] = await pool.query(`
        SELECT status, COUNT(*) as count 
        FROM game_entries 
        GROUP BY status
      `);
            res.json({
                total_games: totalGames[0].total,
                total_entries: totalEntries[0].total,
                total_time: totalTime[0].total || 0,
                avg_rating: avgRating[0].avg || 0,
                status_stats: statusStats
            });
        }
        catch (error) {
            res.status(500).json({ error: 'Failed to fetch stats' });
        }
    }
};
