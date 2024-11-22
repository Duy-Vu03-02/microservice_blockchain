import { AuthService } from "@common/auth/auth.service";
import { APIError } from "@common/error/api.error";
import { ErrorCode } from "@config/errors";
import express, { NextFunction, Response, Request } from "express";

export class AuthController {
  public static login = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (req.user) {
        const token = await AuthService.genToken(req.user);
        if (token) {
          res.sendJson({
            data: {
              user: req.user,
              token: token,
            },
          });
          return;
        }
      }

      console.log("docker ps -a -q docker-compose up build docker-compose");
      throw new APIError({
        status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
        errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
        message: "Dang nhap that bai",
      });
    } catch (err) {
      next(err);
    }
  };

  public static loginToken = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      if (req.user) {
        res.sendJson({
          data: req.user,
        });
        return;
      }

      throw new APIError({
        status: ErrorCode.AUTH_ACCOUNT_BLOCKED,
        errorCode: ErrorCode.AUTH_ACCOUNT_BLOCKED,
        message: "Khong the dang nhap",
      });
    } catch (err) {
      next(err);
    }
  };

  public static logOut = async (
    req: Request,
    res: Response,
    next: NextFunction
  ): Promise<void> => {
    try {
      res.sendJson({
        data: {},
      });
      return;
    } catch (err) {
      next(err);
    }
  };
}
