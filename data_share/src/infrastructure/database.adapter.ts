import mongoose from 'mongoose';
import * as dotenv from 'dotenv';
dotenv.config();

export const PORT = process.env.PORT;
export const API_KEY = process.env.API_KEY;
export const URL_RABBITMQ = process.env.URL_RABBITMQ;

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
