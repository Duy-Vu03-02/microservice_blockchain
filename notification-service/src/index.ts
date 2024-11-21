import express, { Request, Response } from "express";
import cors from "cors";
import { DatabaseAdapter } from "./database.apdapter";
import { NotificationController } from "./notification.controler";
import * as dotenv from "dotenv";
dotenv.config();

export class NotificationService {
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

      await NotificationService.registerDatabase();
      await NotificationService.registerRabiit();

      app.listen(process.env.PORT);
    } catch (err) {
      console.error("USER_SERVICE :: Error startup", err);
    }
  }

  public static  async registerDatabase  (){
    try {
      await DatabaseAdapter.connection();
    } catch (err) {
      console.error(err);
    }
  };

  public static async registerRabiit () {
    try {
      await NotificationController.register();
      console.log("Connect RabbitMQ:: Success");
    } catch (err) {
      console.error(err);
    }
  };
}

NotificationService.register()
.then(() => {
  console.log("NOTIFICATION_SERVICE :: Service started successfully");
})
.catch((err) => {
  console.error("NOTIFICATION_SERVICE :: Service startup failed", err);
});
