import express, { Request, Response } from "express";
import cors from "cors";
import { DatabaseAdapter } from "./database.apdapter";
import { UserController } from "./user.controller";
import * as dotenv from "dotenv";
dotenv.config();
import { EventBus } from "./event";
import router from "./user.router";



export class UserService {
  public static async register() {
    try {
      const app = express();

      app.use(
        cors({
          origin: "*",
        })
      );
      app.use(express.json());
      app.use(express.urlencoded({ extended: true }));
      app.use(router);
      await UserService.registerDatabase();
      await UserService.registerRabbit();
      UserService.registerEventBus();

      app.listen(process.env.PORT);
    } catch (err) {
      console.error("USER_SERVICE :: Error startup", err);
    }
  }

  public static registerDatabase = async () => {
    try {
      await DatabaseAdapter.connection();
    } catch (err) {
      console.error("USER_SERVICE :: Error database", err);
    }
  };

  public static registerRabbit = async () => {
    try {
      await UserController.register();
      console.log("Connect RabbitMQ:: Success");
    } catch (err) {
      console.error("USER_SERVICE :: Error  RabbitMQ", err);
    }
  };

  public static registerEventBus = () => {
    try {
      EventBus.register();
    } catch (err) {
      console.error("USER_SERVICE :: Error EventBus", err);
    }
  };
}

// Khởi chạy User Service
UserService.register()
  .then(() => {
    console.log("USER_SERVICE :: Service started successfully");
  })
  .catch((err) => {
    console.error("USER_SERVICE :: Service startup failed", err);
  });
