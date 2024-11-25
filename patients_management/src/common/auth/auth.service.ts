import { APIError } from '@common/error/api.error';
import { IUser, IUserReponse, UserModel } from '@common/user/user';
import { ErrorCode } from '@config/errors';
import { ILoginRequest, UserRoleGroupAdmin } from './auth';
import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { API_KEY } from '@config/environment';

export class AuthService {
    public static loginByToken = async (req: Request): Promise<IUserReponse> => {
        const HEADER_AUTH = 'x-header-auth';
        const token = req.header(HEADER_AUTH);

        try {
            if (token) {
                const verify = await AuthService.verifyToken(token);

                if (verify) {
                    const payloadBase64 = token.split('.')[1];
                    const payload: IUserReponse = JSON.parse(Buffer.from(payloadBase64, 'base64').toString('utf-8'));

                    if (payload) {
                        if (!UserRoleGroupAdmin.includes(payload.role)) {
                            throw new APIError({
                                status: ErrorCode.SERVER_AUTH_ERROR,
                                errorCode: ErrorCode.SERVER_AUTH_ERROR,
                                message: 'Permission denied - The rule permission',
                            });
                        }

                        const user: IUserReponse = {
                            id: payload.id ?? undefined,
                            role: payload.role ?? undefined,
                            name: payload.name ?? undefined,
                            hospital_id: payload.hospital_id ?? undefined,
                        };

                        return user;
                    }
                }
            }
            return null;
        } catch (err) {
            return null;
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
