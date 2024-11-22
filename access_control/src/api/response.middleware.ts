import { NextFunction, Request, Response } from "express";
import { APIError } from "@common/error/api.error";
import { NODE_ENV } from "@config/environment";
import { ValidationError } from "express-validation";
import { ErrorCode } from "@config/errors";
import { pick } from "lodash";

export class ResponseMiddleware {
  /**
   * Handle error
   * @param err APIError
   * @param req
   * @param res
   * @param next
   */
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  static handler(
    err: APIError,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    const { status = ErrorCode.AUTH_ACCOUNT_BLOCKED, errorCode = 1 } = err;

    const response = {
      error_code: errorCode,
      message: err.message ? err.message : ErrorCode[status],
      stack: err.stack,
      errors: err.errors,
    };

    if (NODE_ENV !== "development") {
      delete response.stack;
      delete response.errors;
    }

    res.status(status);
    res.json(response);
    res.end();
    return;
  }

  static converter(
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ): void {
    let convertedError: APIError;
    if (err instanceof ValidationError) {
      convertedError = new APIError({
        message: ResponseMiddleware.getMessageOfValidationError(err),
        status: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
        errors: err.details,
        stack: err.error,
        errorCode: ErrorCode.VERIFY_FAILED,
      });
    } else if (err instanceof APIError) {
      convertedError = err;
    } else {
      convertedError = new APIError({
        message: err.message,
        status: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
        stack: err.stack,
        errorCode: ErrorCode.SERVER_ERROR,
      });
    }
    // log error for status >= 500
    if (convertedError.status >= ErrorCode.AUTH_ACCOUNT_NOT_FOUND) {
      // logger.error('Process request error:', {
      //     stringData: JSON.stringify(err),
      //     ...pick(req, ['originalUrl', 'body', 'rawHeaders']),
      // });
    }

    return ResponseMiddleware.handler(convertedError, req, res, next);
  }

  static getMessageOfValidationError(error: ValidationError): string {
    try {
      const details = error.details;
      if (
        details.body !== undefined &&
        details.body !== null &&
        details.body.length > 0
      ) {
        return details.body[0].message;
      } else if (
        details.query !== undefined &&
        details.query !== null &&
        details.query.length > 0
      ) {
        return details.query[0].message;
      } else if (
        details.params !== undefined &&
        details.params !== null &&
        details.params.length > 0
      ) {
        return details.params[0].message;
      } else if (
        details.headers !== undefined &&
        details.headers !== null &&
        details.headers.length > 0
      ) {
        return details.headers[0].message;
      }
    } catch (error) {
      //   logger.error("Error during get message from ValidationError", error);
    }
    return "common.validate_fail";
  }

  /**
   * Notfound middleware
   * @param req
   * @param res
   * @param next
   */
  static notFound(req: Request, res: Response, next: NextFunction): void {
    const err = new APIError({
      message: "Not found",
      status: ErrorCode.AUTH_ACCOUNT_NOT_FOUND,
      stack: "",
      errorCode: ErrorCode.REQUEST_NOT_FOUND,
    });
    return ResponseMiddleware.handler(err, req, res, next);
  }
}
