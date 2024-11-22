import express, { Express, Request, Response, NextFunction } from "express";
import { Server } from "http";
import helmet from "helmet";
import routes from "@api/router";
import { ResponseMiddleware } from "@api/response.middleware";
import { APIError } from "@common/error/api.error";

express.response.sendJson = function (data: object) {
  return this.json({ error_code: 0, message: "OK", ...data });
};

export class ExpressServer {
  private server?: Express;
  private httpServer?: Server;

  public async setup(port: number): Promise<Express> {
    const server = express();
    this.setupStandardMiddlewares(server);
    // this.setupSecurityMiddlewares(server);
    this.configureRoutes(server);
    this.setupErrorHandlers(server);

    this.httpServer = this.listen(server, port);
    this.server = server;
    return this.server;
  }

  public listen(server: Express, port: number): Server {
    return server.listen(port);
  }

  public async kill(): Promise<void> {
    return new Promise((resolve, reject) => {
      if (this.httpServer) {
        this.httpServer.close((err) => {
          if (err) {
            reject(err);
          } else {
            resolve();
          }
        });
      } else {
        resolve();
      }
    });
  }

  private setupSecurityMiddlewares(server: Express) {
    server.use(helmet());
    // server.use(helmet.referrerPolicy({ policy: "same-origin" }));
    // server.use(
    //   helmet.contentSecurityPolicy({
    //     directives: {
    //       defaultSrc: ["'self'"],
    //       styleSrc: ["'unsafe-inline'"],
    //       scriptSrc: ["'unsafe-inline'", "'self'"],
    //     },
    //   })
    // );
  }

  private setupStandardMiddlewares(server: Express) {
    server.use(express.json());
    server.use(express.urlencoded({ extended: true }));
  }

  private configureRoutes(server: Express) {
    server.use(routes);
  }

  private setupErrorHandlers(server: Express) {
    // if error is not an instanceOf APIError, convert it.
    server.use(ResponseMiddleware.converter);

    // catch 404 and forward to error handler
    server.use(ResponseMiddleware.notFound);

    // // error handler, send stacktrace only during development
    server.use(ResponseMiddleware.handler);
  }
}
