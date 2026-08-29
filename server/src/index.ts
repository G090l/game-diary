import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import gamesRouter from './routes/games';
import entriesRouter from './routes/entries';
import { connectDB } from './config/database';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

app.use('/api/games', gamesRouter);
app.use('/api/entries', entriesRouter);

app.get('/', (req, res) => {
    res.json({
        message: 'Game Diary API is running',
        endpoints: {
            games: '/api/games',
            entries: '/api/entries',
            stats: '/api/entries/stats'
        }
    });
});

app.use((req, res) => {
    res.status(404).json({
        error: 'Not Found',
        message: `Route ${req.url} not found`
    });
});

app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Error:', err);
    res.status(500).json({ error: 'Internal Server Error', message: err.message });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`📝 Test: http://localhost:${PORT}/`);
    console.log(`🎮 Games: http://localhost:${PORT}/api/games`);
    console.log(`📋 Entries: http://localhost:${PORT}/api/entries`);
});