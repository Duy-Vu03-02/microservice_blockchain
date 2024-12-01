import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.POR;
export const API_KEY = process.env.API_KEY || null;
export const URL_RABBITMQ = process.env.URL_RABBITMQ || null;
export const BUILD_URL = process.env.BUILD_URL || null;
export const GANACHE_URL = process.env.GANACHE_URL || null;

export class DatabaseAdapter {
    public static connect = async () => {
        try {
            await mongoose.connect(process.env.URL_MONGO, {});
            console.log('Connect DB :: SUCCESS');
        } catch (err) {
            console.error(err);
            process.exit(1);
        }
    };
}
