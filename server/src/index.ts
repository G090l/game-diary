import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mysql from 'mysql2/promise';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

let pool: mysql.Pool;

async function connectDB() {
    try {
        const config = {
            host: process.env.DB_HOST || 'MySQL-8.0',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'game_diary',
            port: parseInt(process.env.DB_PORT || '3306'),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0,
            connectTimeout: 10000
        };

        console.log('🔄 Подключение к MySQL...');
        console.log('📊 Параметры подключения:');
        console.log(`   Хост: ${config.host}`);
        console.log(`   Порт: ${config.port}`);
        console.log(`   Пользователь: ${config.user}`);
        console.log(`   Пароль: ${config.password ? '***' : '(пустой)'}`);
        console.log(`   База: ${config.database}`);

        pool = mysql.createPool(config);

        // Проверяем подключение
        const connection = await pool.getConnection();
        console.log('✅ Подключение к MySQL успешно!');
        connection.release();

        return pool;
    } catch (error: any) {
        console.error('❌ Ошибка подключения к БД:');
        console.error(`   Код: ${error.code}`);
        console.error(`   Сообщение: ${error.message}`);
        throw error;
    }
}

// Маршруты
app.get('/', (req, res) => {
    res.json({
        message: 'Game Diary API is running',
        endpoints: {
            test: '/api/test',
            testDb: '/api/test-db',
            games: '/api/games',
            entries: '/api/entries'
        }
    });
});

app.get('/api/test', (req, res) => {
    res.json({
        message: 'Server is working!',
        timestamp: new Date().toISOString(),
        status: 'OK'
    });
});

app.get('/api/test-db', async (req, res) => {
    try {
        if (!pool) {
            throw new Error('Пул соединений не инициализирован');
        }
        const [result] = await pool.query('SELECT 1 + 1 as result');
        res.json({
            message: '✅ Database connection is working!',
            result: result,
            timestamp: new Date().toISOString()
        });
    } catch (error: any) {
        res.status(500).json({
            message: '❌ Database connection failed',
            error: error.message,
            code: error.code
        });
    }
});

// Запуск сервера
async function startServer() {
    try {
        await connectDB();
        app.listen(PORT, () => {
            console.log(`✅ Server running on port ${PORT}`);
            console.log(`📝 Test: http://localhost:${PORT}/api/test`);
            console.log(`🗄️  DB Test: http://localhost:${PORT}/api/test-db`);
        });
    } catch (error) {
        console.error('❌ Не удалось запустить сервер');
        process.exit(1);
    }
}

startServer();