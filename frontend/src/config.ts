import dotenv from 'dotenv';
dotenv.config();

export const BACKEND_URL = process.env.DATABASE_URL;