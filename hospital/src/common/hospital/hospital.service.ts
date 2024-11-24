import { ethers } from 'ethers';
import { IAuthUser } from '@common/auth/auth';
import { APIError } from '@common/error/api.error';
import { ErrorCode } from '@config/errors';
import eventbus from '@common/event';
import { EventRegister } from '@common/event/event';
import { HospitalModel, IHospitalRegister, IHospitalId, IHospitalReponse } from './hospital';

export class HospitalsService {
    public static createHospital = async (user: IAuthUser, req: IHospitalRegister): Promise<IHospitalReponse> => {
        if (user && req) {
            const { name, phone } = req;

            if (name && phone) {
                const old_hospital = await HospitalModel.findOne({
                    phone,
                });

                if (old_hospital) {
                    throw new APIError({
                        status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
                        errorCode: ErrorCode.AUTH_ACCOUNT_EXISTS,
                        message: 'Da tton tai benh vien nay',
                    });
                } else {
                    const wallet = ethers.Wallet.createRandom();

                    const privateKey = wallet.privateKey;
                    const publicKey = wallet.address;

                    const hospital = await HospitalModel.create({
                        name,
                        phone,
                        publicKey: publicKey,
                        privateKey: privateKey,
                    });

                    if (hospital) {
                        eventbus.emit(EventRegister.EVENT_CREATE_PATIENT, {
                            admin_id: user.id,
                            admin_name: user.name,
                            user_id: hospital._id,
                            user_name: hospital.name,
                            action: 'create hospital',
                        });
                        return hospital.transform();
                    }
                }
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khong the tao hospital',
        });
    };

    public static getAllHospitals = async (user: IAuthUser): Promise<IHospitalReponse[]> => {
        if (user) {
            const allPatients = await HospitalModel.find();

            if (allPatients?.length > 0) {
                return allPatients.map((item) => item.transform());
            }

            return [];
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
            errorCode: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
            message: 'Khong the lay danh sach hospital',
        });
    };

    public static getHospital = async (user: IAuthUser, req: IHospitalId): Promise<IHospitalReponse> => {
        if (req.id) {
            const patients = await HospitalModel.findById(req.id);

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

    public static updateHospital = async (user: IAuthUser, req: IHospitalReponse): Promise<IHospitalReponse> => {
        if (user && req && req.id) {
            const patients = await HospitalModel.findByIdAndUpdate(
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
                    action: 'update hospital',
                });
                return patients.transform();
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khong the cap nhat hospital',
        });
    };

    public static deleteHospital = async (user: IAuthUser, req: IHospitalId): Promise<boolean> => {
        if (user && req && req.id) {
            const deleted = await HospitalModel.findByIdAndDelete(req.id);

            if (deleted) {
                eventbus.emit(EventRegister.EVENT_DELETE_PATIENT, {
                    admin_id: user.id,
                    admin_name: user.name,
                    user_id: req.id,
                    user_name: deleted.name ?? undefined,
                    action: 'delete hospital',
                });
                return true;
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khong the xoa hospital',
        });
    };
}
