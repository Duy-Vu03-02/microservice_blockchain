import { APIError } from '@common/error/api.error';
import { IPatientsId, IPatientsNewHistory, IPatientsRegister, IPatientsReponse } from '@common/patients/patient';
import { PatientsService } from '@common/patients/patient.service';
import { ErrorCode } from '@config/errors';
import { Request, Response, NextFunction } from 'express';

export class PatientsController {
    public static createPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await PatientsService.createPatients(req.user, req.body as IPatientsRegister);

            if (data) {
                res.sendJson({
                    data: data,
                });
                return;
            }

            throw new APIError({
                status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                message: 'Khong the tao patient',
            });
        } catch (err) {
            next(err);
        }
    };

    public static getAllPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await PatientsService.getAllPatients(req.user);

            if (data) {
                res.sendJson({
                    data: data,
                });
                return;
            }

            throw new APIError({
                status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                message: 'Khong the lay danh sach patient',
            });
        } catch (err) {
            next(err);
        }
    };

    public static getPatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await PatientsService.getPatients(req.user, req.params as unknown as IPatientsId);

            if (data) {
                res.sendJson({
                    data: data,
                });
                return;
            }

            throw new APIError({
                status: ErrorCode.REQUEST_NOT_FOUND,
                errorCode: ErrorCode.REQUEST_NOT_FOUND,
                message: 'Khong ton tai benh nhan nay',
            });
        } catch (err) {
            next(err);
        }
    };

    public static updatePatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await PatientsService.updatePatients(req.user, req.body as IPatientsReponse);

            if (data) {
                res.sendJson({
                    data: data,
                });
                return;
            }

            throw new APIError({
                status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                message: 'Khong the cap nhat patient',
            });
        } catch (err) {
            next(err);
        }
    };

    public static deletePatients = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const deleted: boolean = await PatientsService.deletePatients(
                req.user,
                req.params as unknown as IPatientsId,
            );

            if (deleted) {
                res.sendJson({
                    data: {},
                });
            }

            throw new APIError({
                status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                message: 'Xoa patients khong thanh cong',
            });
        } catch (err) {
            next(err);
        }
    };

    public static updateHistory = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await PatientsService.updateHistory(req.user, req.body as IPatientsNewHistory);

            if (data) {
                res.sendJson({
                    data: data,
                });
                return;
            }

            throw new APIError({
                status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                message: 'Khong the them lich su',
            });
        } catch (err) {
            next(err);
        }
    };
}
