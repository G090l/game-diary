import mysql from 'mysql2/promise';
import dotenv from 'dotenv';

dotenv.config();

let pool: mysql.Pool;

export const connectDB = async () => {
    try {
        pool = mysql.createPool({
            host: process.env.DB_HOST || 'localhost',
            user: process.env.DB_USER || 'root',
            password: process.env.DB_PASSWORD || '',
            database: process.env.DB_NAME || 'game_diary',
            port: parseInt(process.env.DB_PORT || '3306'),
            waitForConnections: true,
            connectionLimit: 10,
            queueLimit: 0
        });

        console.log('Connected to MySQL database');
    } catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};

export const getPool = () => pool;