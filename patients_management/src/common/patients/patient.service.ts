import { IAuthUser } from '@common/auth/auth';
import { APIError } from '@common/error/api.error';
import { ErrorCode } from '@config/errors';
import eventbus from '@common/event';
import { EventRegister } from '@common/event/event';
import { IPatientsId, IPatientsNewHistory, IPatientsRegister, IPatientsReponse, PatientsModel } from './patient';

export class PatientsService {
    public static createPatients = async (user: IAuthUser, req: IPatientsRegister): Promise<IPatientsReponse> => {
        if (user && req) {
            const { name, age, history, cccd } = req;

            if (name && age && cccd) {
                const old_patient = await PatientsModel.findOne({
                    cccd,
                });

                if (old_patient) {
                    throw new APIError({
                        status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                        errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                        message: 'Bnh nhan da ton tai',
                    });
                } else {
                    const patients = await PatientsModel.create({
                        name,
                        age,
                        history,
                        cccd,
                    });

                    if (patients) {
                        eventbus.emit(EventRegister.EVENT_CREATE_PATIENT, {
                            admin_id: user.id,
                            admin_name: user.name,
                            user_id: patients._id,
                            user_name: patients.name,
                            action: 'create patients',
                        });
                        return patients.transform();
                    }
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
                eventbus.emit(EventRegister.EVENT_UPDATE_PATIENT, {
                    admin_id: user.id,
                    admin_name: user.name,
                    user_id: patients._id,
                    user_name: patients.name,
                    action: 'update patients',
                });
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
                eventbus.emit(EventRegister.EVENT_DELETE_PATIENT, {
                    admin_id: user.id,
                    admin_name: user.name,
                    user_id: req.id,
                    user_name: deleted.name ?? undefined,
                    action: 'delete patients',
                });
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
                eventbus.emit(EventRegister.EVENT_UPDATE_PATIENT, {
                    admin_id: user.id,
                    admin_name: user.name,
                    user_id: patient._id,
                    user_name: patient.name,
                    action: 'update history patient',
                });
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
