import express, {Express, Response, Request, NextFunction} from "express";
import amqplib from "amqplib";
import { ChatModel } from "./chat.model";
import * as dotenv from "dotenv";
import os from "os";
dotenv.config();


export class ChatController {
  private static nameExchange: string = "exchange_microservice";
  private static responseQueue: string = "#.chat.#";
  private static urlRabbit: string = process.env.URL_RABBITMQ;

  public static register = async (): Promise<void> => {
    try {
      const conn = await amqplib.connect(ChatController.urlRabbit);
      const channel = await conn.createChannel();

      await channel.assertExchange(ChatController.nameExchange, "topic", {
        durable: false,
        autoDelete: true,
      });

      const q = await channel.assertQueue("", {
        exclusive: true,
      });

      await channel.bindQueue(
        q.queue,
        ChatController.nameExchange,
        ChatController.responseQueue
      );

      await channel.consume(
        q.queue,
        async (data) => {
          const { email, message, friend_email } = JSON.parse(
            data.content.toString()
          );
          if (friend_email && email && message) {
            await ChatModel.findOneAndUpdate(
              {
                member: {
                  $in: [email, friend_email],
                },
              },
              {
                member: [email, friend_email],
                $push: {
                  messages: {
                    sender: email,
                    message: message,
                  },
                },
              },
              {
                new: true,
                upsert: true,
              }
            );
          }
        },
        {
          noAck: false,
        }
      );
    } catch (err) {
      console.error(err);
    }
  };

  public static getAllMessage = async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
      const {id} = req.body;
      if(id){
        const messages = await ChatModel.find({
          member: {
            $in: [id],
          }
        })
        if(messages && messages.length >= 0){
          console.log("Chat-service: ", os.hostname);
          return messages;
        }
      }
      return [];
    }
    catch(err){
      console.error(err);
      return [];
    }
  }
}
