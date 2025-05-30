import dotenv from 'dotenv';

dotenv.config();

export const allowedOrigins = process.env.ALLOWED_ORIGINS;
export const blandApiKey = process.env.BLAND_API_KEY;