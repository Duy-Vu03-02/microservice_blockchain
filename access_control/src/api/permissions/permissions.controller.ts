import { PermissionService } from "@common/permission/permission.service";
import express, { Request, Response, NextFunction } from "express";
import { IPermissionRequest } from "@common/permission/permission";
import { APIError } from "@common/error/api.error";
import { ErrorCode } from "@config/errors";
import { IUserRegister } from "@common/user/user";
import { AuthService } from "@common/auth/auth.service";
import { API_KEY } from "@config/environment";

export class PermissionController {
  public static create = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = await PermissionService.create(req.body as IUserRegister);

      if (user) {
        const token = await AuthService.genToken(user);

        if (token) {
          res.sendJson({
            data: {
              user: user,
              token: token,
            },
          });
          return;
        }
      }

      throw new APIError({
        status: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
        errorCode: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
        message: "Khong the tao user",
      });
    } catch (err) {
      next(err);
    }
  };

  public static addPermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const data = await PermissionService.addPermission(
        req.user,
        req.body as IPermissionRequest
      );

      if (data) {
        res.sendJson({
          data: data,
        });
        return;
      }

      throw new APIError({
        status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
        errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
        message: "Khong the cap nhat quyen han",
      });
    } catch (err) {
      next(err);
    }
  };

  public static removePermission = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      const user = PermissionService.removePermission(
        req.user,
        req.body as IPermissionRequest
      );

      if (user) {
        res.sendJson({
          data: user,
        });

        return;
      }

      throw new APIError({
        status: ErrorCode.SERVER_AUTH_ERROR,
        errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
        message: "Khong the cap nhat quan han",
      });
    } catch (err) {
      next(err);
    }
  };
}
