import { APIError } from "@common/error/api.error";
import { IUser, IUserReponse, UserModel } from "@common/user/user";
import { ErrorCode } from "@config/errors";
import { ILoginRequest } from "./auth";
import { Request } from "express";
import jwt from "jsonwebtoken";
import { API_KEY } from "@config/environment";

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
      if (token) {
        const verify = AuthService.verifyToken(token);

        if (verify) {
          const payloadBase64 = token.split(".")[1];
          const payload: IUserReponse = JSON.parse(
            Buffer.from(payloadBase64, "base64").toString("utf-8")
          );

          if (payload) {
            const user: IUserReponse = {
              id: payload.id ?? undefined,
              role: payload.role ?? undefined,
              name: payload.name ?? undefined,
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

  public static genToken = async (user: IUserReponse): Promise<unknown> => {
    try {
      if (user && API_KEY) {
        // token vv
        const token = jwt.sign(user, API_KEY);
        if (token && token.trim() !== "") {
          return token;
        }
      }
      return null;
    } catch (err) {
      return null;
    }
  };

  public static verifyToken = async (token: string): Promise<boolean> => {
    try {
      if (token && token.trim() !== "") {
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
