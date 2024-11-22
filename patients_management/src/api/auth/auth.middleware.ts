import { Request, Response, NextFunction } from 'express';
import { AuthService } from '@common/auth/auth.service';
import { ErrorCode } from '@config/errors';
import { APIError } from '@common/error/api.error';

export class AuthMiddleware {
    public static verifyToken = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const user = await AuthService.loginByToken(req);

            if (user) {
                req.user = user;
                next();
                return;
            }

            throw new APIError({
                status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                message: 'Tonken da het han',
            });
        } catch (err) {
            next(err);
        }
    };
}
