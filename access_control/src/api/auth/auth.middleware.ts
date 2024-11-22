import express, { Request, Response, NextFunction } from "express";
import { APIError } from "@common/error/api.error";
import { AuthService } from "@common/auth/auth.service";
import { ILoginRequest } from "@common/auth/auth";
import { ErrorCode } from "@config/errors";

export class AuthMiddleware {
  static async login(
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> {
    try {
      const user = await AuthService.login(req.body as ILoginRequest);

      if (!user) {
        throw new APIError({
          message: `auth.login.${ErrorCode.AUTH_ACCOUNT_BLOCKED}.${ErrorCode.SERVER_AUTH_ERROR}`,
          status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
          errorCode: ErrorCode.SERVER_AUTH_ERROR,
        });
      }

      req.user = user;
      next();
    } catch (error) {
      next(error);
    }
  }

  public static loginByToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    try {
      const user = await AuthService.loginByToken(req);

      if (user) {
        req.user = user;
      }

      throw new APIError({
        status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
        errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
        message: "Tonken da het han",
      });
    } catch (err) {
      next(err);
    }
  };

  public static logout = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.sendJson({
        data: {},
      });
    } catch (err) {
      next(err);
    }
  };
}
