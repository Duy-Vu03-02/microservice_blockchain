import amqplib, { Channel, Connection } from "amqplib";
import eventbus, { EVENT_USER } from "./event";
import express, { Request, Response } from "express";
import { UserModel } from "./user.model";
import * as dotenv from "dotenv";
import os from "os";
dotenv.config();

export class UserController {
  private static channel: Channel;
  private static conn: Connection;
  public static nameExchange: string = "exchange_microservice";
  public static requestQueue: string = "chat.notification";
  private static urlRabbit: string = process.env.URL_RABBITMQ;

  public static register = async (): Promise<Channel> => {
    try {
      if (!UserController.channel) {
        const conn = await amqplib.connect(UserController.urlRabbit);
        const channel = await conn.createChannel();
        UserController.channel = channel;

        return channel;
      }
      return UserController.channel;
    } catch (err) {
      console.error(err);
    }
  };

  public static sendMess = async (
    req: Request,
    res: Response
  ): Promise<void> => {
    try {
      const { email, message, friend_email } = req.body;
      if (friend_email && email && message) {
        const user = await UserModel.findOneAndUpdate(
          {
            email,
          },
          {
            $push: {
              messages: {
                friend_email,
                message,
              },
            },
          },
          {
            new: true,
            upsert: true,
          }
        );

        if (user) {
          eventbus.emit(EVENT_USER, { email, message, friend_email });
        }

        res.status(200).json({
          service: `User-Service-host: ${os.hostname}`,
          data: "Send SUCCESS!",
        });
        return;
      }

      res.sendStatus(404);
      return;
    } catch (err) {
      console.error(err);
    }
  };
}
