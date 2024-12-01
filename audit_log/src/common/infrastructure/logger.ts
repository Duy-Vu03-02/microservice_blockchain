import winston from 'winston';
import path from 'path';

export const logger = winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    transports: [new winston.transports.Console(), new winston.transports.File({ filename: 'logs/app.log' })],
});

export const createLogger = (serviceName: string): winston.Logger => {
    const logFilePath = path.join('logs', `${serviceName}.log`);

    return winston.createLogger({
        level: 'info',
        format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
        transports: [new winston.transports.Console(), new winston.transports.File({ filename: logFilePath })],
    });
};
