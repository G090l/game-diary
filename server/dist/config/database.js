"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPool = exports.connectDB = void 0;
const promise_1 = __importDefault(require("mysql2/promise"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
let pool;
const connectDB = async () => {
    try {
        pool = promise_1.default.createPool({
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
    }
    catch (error) {
        console.error('Database connection error:', error);
        process.exit(1);
    }
};
exports.connectDB = connectDB;
const getPool = () => pool;
exports.getPool = getPool;
