import { IAuditLog, IPermissionRequest } from "./permission";
import { IAuthUser, UserRole } from "@common/auth/auth";
import { APIError } from "@common/error/api.error";
import {
  IUser,
  IUserRegister,
  IUserReponse,
  UserModel,
} from "@common/user/user";
import { ErrorCode } from "@config/errors";
import eventbus from "@common/event";
import { EventRegister } from "@common/event/event";

export class PermissionService {
  public static create = async (req: IUserRegister): Promise<IUserReponse> => {
    const { name, account, password, role } = req;
    if (name && account && password) {
      const user = await UserModel.create({
        name: name,
        account: account,
        password: password,
        role: UserRole.USER,
      });

      if (user) {
        return user.transform();
      }
    }

    throw new APIError({
      status: ErrorCode.AUTH_ACCOUNT_EXISTS,
      errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
      message: "Khong the tao user",
    });
  };

  public static addPermission = async (
    req: IAuthUser,
    user: IPermissionRequest
  ): Promise<IUserReponse> => {
    if (req && user) {
      if (req.role !== UserRole.PATIENT && req.role !== UserRole.USER) {
        const user_update = await UserModel.findByIdAndUpdate(
          user.user_id,
          {
            role: user.role,
          },
          { new: true }
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
      message: "Khogn the cap nhat quyen han",
    });
  };

  public static removePermission = async (
    req: IAuthUser,
    user: IPermissionRequest
  ): Promise<IUserReponse> => {
    if (req && user) {
      if (req.role !== UserRole.USER && req.role !== UserRole.PATIENT) {
        const user_update = await UserModel.findByIdAndUpdate(
          user.user_id,
          {
            role: user.role,
          },
          { new: true }
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
      message: "Khong the thu hoi quyen han",
    });
  };
}
