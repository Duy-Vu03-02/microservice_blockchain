import { PermissionService } from "@common/permission/permission.service";
import { UserModel } from "@common/user/user";
import express, { Request, Response, NextFunction } from "express";
import { IPermissionRequest } from "./permission";
import { APIError } from "@common/error/api.error";
import { ErrorCode } from "@config/errors";

export class PermissionController {
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
