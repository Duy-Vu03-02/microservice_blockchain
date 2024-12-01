/* eslint-disable @typescript-eslint/ban-types */
import { IAuthUser } from "../../src/auth/auth.middleware";

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
