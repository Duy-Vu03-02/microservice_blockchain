import * as dotenv from "dotenv";
dotenv.config();

export const URL_MONGO = process.env.URL_MONGO || null;
export const URL_RABBITMQ = process.env.URL_RABBITMQ || null;
export const URL_REDIS = process.env.URL_REDIS || null;
export const PORT = parseInt(process.env.PORT) || 8080;
export const NODE_ENV = "development";
export const API_KEY = process.env.API_KEY || null;
