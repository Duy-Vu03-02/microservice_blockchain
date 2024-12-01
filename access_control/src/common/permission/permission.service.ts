import { IAuditLog, IPermissionRequest } from './permission';
import { IAuthUser, UserRole } from '@common/auth/auth';
import { APIError } from '@common/error/api.error';
import { IUser, IUserRegister, IUserReponse, UserModel } from '@common/user/user';
import { ErrorCode } from '@config/errors';
import eventbus from '@common/event';
import { EventRegister } from '@common/event/event';

export class PermissionService {
    public static create = async (req: IUserRegister): Promise<IUserReponse> => {
        const { name, account, password, role } = req;
        if (account) {
            const old_user = await UserModel.findOne({ account: account });

            if (old_user) {
                throw new APIError({
                    status: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
                    errorCode: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
                    message: 'Tai khoan da ton tai',
                });
            } else {
                if (name && password) {
                    const user = await UserModel.create({
                        name: name,
                        account: account,
                        password: password,
                        role: UserRole.USER,
                        hospital_id: req.hospital_id,
                    });

                    if (user) {
                        return user.transform();
                    }
                }
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_EXISTS,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khong the tao user',
        });
    };

    public static addPermission = async (req: IAuthUser, user: IPermissionRequest): Promise<IUserReponse> => {
        if (req && user) {
            if (req.role === UserRole.SYS || req.role === UserRole.BHYT || req.role === UserRole.DOCTOR) {
                if (Object.values(UserRole).includes(user.role)) {
                    const user_update = await UserModel.findByIdAndUpdate(
                        user.user_id,
                        {
                            role: user.role,
                        },
                        { new: true },
                    );

                    if (user_update) {
                        eventbus.emit(EventRegister.EVENT_CHANGE_PERMISSION, {
                            admin_id: req.id,
                            admin_name: req.name,
                            role: user.role,
                            user_id: user.user_id,
                            user_name: user_update.name,
                        } as IAuditLog);

                        return user_update.transform();
                    }
                }
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khogn the cap nhat quyen han',
        });
    };

    public static removePermission = async (req: IAuthUser, user: IPermissionRequest): Promise<IUserReponse> => {
        if (req && user) {
            if (req.role === UserRole.SYS || req.role === UserRole.BHYT || req.role === UserRole.DOCTOR) {
                const user_update = await UserModel.findByIdAndUpdate(
                    user.user_id,
                    {
                        role: UserRole.USER,
                    },
                    { new: true },
                );

                if (user_update) {
                    eventbus.emit(EventRegister.EVENT_CHANGE_PERMISSION, {
                        admin_id: req.id,
                        admin_name: req.name,
                        role: user.role,
                        user_id: user.user_id,
                        user_name: user_update.name,
                    } as IAuditLog);
                    return user_update.transform();
                }
            }
        }

        throw new APIError({
            status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
            message: 'Khong the thu hoi quyen han',
        });
    };
}
