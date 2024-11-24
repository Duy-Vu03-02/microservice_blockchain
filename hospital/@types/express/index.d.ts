/* eslint-disable @typescript-eslint/ban-types */
import { IAuthUser } from "@common/auth/auth";

declare global {
  namespace Express {
    interface Request {
      user?: IAuthUser;
    }

    interface Response {
      sendJson(data: unknown): this;
    }
  }
}

export {};
