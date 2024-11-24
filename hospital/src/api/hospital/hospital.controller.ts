import { APIError } from '@common/error/api.error';
import { IHospitalId, IHospitalRegister, IHospitalReponse } from '@common/hospital/hospital';
import { HospitalsService } from '@common/hospital/hospital.service';
import { ErrorCode } from '@config/errors';
import { Request, Response, NextFunction } from 'express';

export class HospitalController {
    public static createHospital = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await HospitalsService.createHospital(req.user, req.body as IHospitalRegister);

            if (data) {
                res.sendJson({
                    data: data,
                });
                return;
            }

            throw new APIError({
                status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                message: 'Khong the tao Hospital',
            });
        } catch (err) {
            next(err);
        }
    };

    public static getAllHospital = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await HospitalsService.getAllHospitals(req.user);

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

    public static getHospital = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await HospitalsService.getHospital(req.user, req.params as unknown as IHospitalId);

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

    public static updateHospital = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            const data = await HospitalsService.updateHospital(req.user, req.body as IHospitalReponse);

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

    public static deleteHospital = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
        try {
            console.log(req.user);
            const deleted: boolean = await HospitalsService.deleteHospital(
                req.user,
                req.params as unknown as IHospitalId,
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
}
