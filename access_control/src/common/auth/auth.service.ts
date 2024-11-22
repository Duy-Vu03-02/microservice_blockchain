import { APIError } from "@common/error/api.error";
import { IUser, IUserReponse, UserModel } from "@common/user/user";
import { ErrorCode } from "@config/errors";
import { ILoginRequest } from "./auth";
import { Request } from "express";

export class AuthService {
  public static login = async (req: ILoginRequest): Promise<IUserReponse> => {
    const { account, password } = req;

    if (account && password) {
      const user = await UserModel.findOne({
        account,
      });

      if (user && user.password === password) {
        return user.transform();
      }
    }

    throw new APIError({
      status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
      errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
      message: "Khong ton tai nguoi dung",
    });
  };

  public static loginByToken = async (req: Request): Promise<IUserReponse> => {
    const HEADER_AUTH = "x-header-auth";

    const token = req.header(HEADER_AUTH);

    try {
      const payload = JSON.parse(
        Buffer.from(token, "base64").toString("utf-8")
      );

      if (payload) {
        const user = {
          id: payload.id ?? undefined,
          role: payload.role ?? undefined,
          name: payload.name ?? undefined,
        };
        return user;
      }

      return null;
    } catch (err) {
      return null;
    }
  };
}
