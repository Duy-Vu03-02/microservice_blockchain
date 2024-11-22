import { IAuthUser } from '@common/auth/auth';
import { APIError } from '@common/error/api.error';
import { ErrorCode } from '@config/errors';
import eventbus from '@common/event';
import { EventRegister } from '@common/event/event';
import { IPatientsId, IPatientsNewHistory, IPatientsRegister, IPatientsReponse, PatientsModel } from './patient';

export class PatientsService {
    public static createPatients = async (user: IAuthUser, req: IPatientsRegister): Promise<IPatientsReponse> => {
        if (user && req) {
            const { name, age, history } = req;

            if (name && age) {
                const patients = await PatientsModel.create({
                    name,
                    age,
                    history,
                });

                if (patients) {
                    eventbus.emit(EventRegister.EVENT_CREATE_PATIENT);
                    return patients.transform();
                }
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khong the cap nhat patient',
        });
    };

    public static getAllPatients = async (user: IAuthUser): Promise<IPatientsReponse[]> => {
        if (user) {
            const allPatients = await PatientsModel.find();

            if (allPatients?.length > 0) {
                return allPatients.map((item) => item.transform());
            }

            return [];
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
            errorCode: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
            message: 'Khong the lay danh sach patient',
        });
    };

    public static getPatients = async (user: IAuthUser, req: IPatientsId): Promise<IPatientsReponse> => {
        if (req.id) {
            const patients = await PatientsModel.findById(req.id);

            if (patients) {
                return patients.transform();
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_EXISTS,
            message: 'Khong ton tai benh nhan nay',
        });
    };

    public static updatePatients = async (user: IAuthUser, req: IPatientsReponse): Promise<IPatientsReponse> => {
        if (user && req && req.id) {
            const patients = await PatientsModel.findByIdAndUpdate(
                req.id,
                {
                    req,
                },
                { new: true },
            );

            if (patients) {
                eventbus.emit(EventRegister.EVENT_UPDATE_PATIENT);
                return patients.transform();
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khong the cap nhat patient',
        });
    };

    public static deletePatients = async (user: IAuthUser, req: IPatientsId): Promise<boolean> => {
        if (user && req && req.id) {
            const deleted = await PatientsModel.findByIdAndDelete(req.id);

            if (deleted) {
                return true;
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khong the xoa patient',
        });
    };

    public static updateHistory = async (user: IAuthUser, req: IPatientsNewHistory): Promise<IPatientsReponse> => {
        if (user && req) {
            const patient = await PatientsModel.findByIdAndUpdate(
                req.id,
                {
                    $push: {
                        history: {
                            time: req.time,
                        },
                    },
                },
                { new: true },
            );

            if (patient) {
                eventbus.emit(EventRegister.EVENT_UPDATE_PATIENT);
                return patient.transform();
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khong the them lich su',
        });
    };
}
