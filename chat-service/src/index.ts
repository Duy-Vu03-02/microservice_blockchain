import express, { Express,Request, Response } from "express";
import cors from "cors";
import { DatabaseAdapter } from "./database.apdapter";
import { ChatController } from "./chat.controller";
import * as dotenv from "dotenv";
import router from "./chat.router";
dotenv.config();


export class ChatService {
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

      await ChatService.registerDatabase();
      await ChatService.registerRabiit();

      app.listen(process.env.PORT);
    } catch (err) {
      console.error("CHAT :: Error startup", err);
    }
  }

  public static async setUpRouter(server: Express){
    server.use(router);
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
      await ChatController.register();
      console.log("Connect RabbitMQ:: Success");
    } catch (err) {
      console.error(err);
    }
  };
}

ChatService.register()
.then(() => {
  console.log("CHAT_SERVICE :: Service started successfully");
})
.catch((err) => {
  console.error("CHAT_SERVICE :: Service startup failed", err);
});
