import express, { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { API_KEY } from '../infrastructure/database.adapter';

export interface ILoginRequest {
    account: string;
    password: string;
}

export enum UserRole {
    USER = 'user',
    PATIENT = 'patient',
    DOCTOR = 'doctor',
    SYS = 'system',
    BHYT = 'bhyt',
}

export interface IAuthUser {
    id: string;
    name: string;
    role: UserRole;
    hospital_id: string;
    token_id?: string;
    parent_token_id?: string;
}

export class AuthMiddleware {
    public static loginByToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const HEADER_AUTH = 'x-header-auth';

            const token = req.header(HEADER_AUTH);

            try {
                if (token) {
                    const verify = await AuthMiddleware.verifyToken(token);

                    if (verify) {
                        const payloadBase64 = token.split('.')[1];
                        const payload: any = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));

                        if (payload) {
                            const user: any = {
                                id: payload.id ?? undefined,
                                role: payload.role ?? undefined,
                                name: payload.name ?? undefined,
                                hospital_id: payload.hospital_id ?? undefined,
                            };
                            req.user = user;
                            next();
                            return;
                        }
                    }
                }

                throw new Error('TOken da het han');
            } catch (err) {
                throw err;
            }
        } catch (err) {
            res.json({ message: err.message });
            res.status(404);
            res.end();
            return;
        }
    };

    public static verifyToken = async (token: string): Promise<boolean> => {
        try {
            if (token && token.trim() !== '') {
                const verify = jwt.verify(token, API_KEY);

                if (verify) {
                    return true;
                }
            }

            return false;
        } catch (err) {
            return false;
        }
    };
}
