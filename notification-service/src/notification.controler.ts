import amqplib, { Channel, Connection } from "amqplib";
import express, { Request, Response, NextFunction } from "express";
import nodemailer, { Transporter } from "nodemailer";
import { NotificationModel } from "./notification.model";
import * as dotenv from "dotenv";
import os from "os";
dotenv.config();

export class NotificationController {
  private static nameExchange: string = "exchange_microservice";
  private static responseQueue: string = "#.notification.#";
  private static urlRabbit: string = process.env.URL_RABBITMQ;

  public static register = async (): Promise<void> => {
    try {
      const conn = await amqplib.connect(NotificationController.urlRabbit);
      const channel = await conn.createChannel();

      await channel.assertExchange(
        NotificationController.nameExchange,
        "topic",
        {
          durable: false,
          autoDelete: true,
        }
      );

      const q = await channel.assertQueue("", {
        exclusive: true,
      });

      await channel.bindQueue(
        q.queue,
        NotificationController.nameExchange,
        NotificationController.responseQueue
      );

      await channel.consume(
        q.queue,
        async (data) => {
          const { message, friend_email, email } = JSON.parse(data.content.toString());
          if (friend_email && message && email) {
            await NotificationController.sendMailer({
              message,
              friend_email,
              email
            });
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

  public static sendMailer = async (job: any): Promise<void> => {
    try {
      const transporter = nodemailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: true,
        auth: {
          user: "duyvu11122002@gmail.com",
          pass: "fawk iisk rxfa eobz",
        },
      });

      const infor = await transporter.sendMail({
        from: `Ngô Duy Vũ `,
        to: job.friend_email,
        subject: "Tin nhan ✔",
        text: "nhan tin",
        html: `
          <h2>${job.friend_email}</h2>
          <h3>Message: ${job.message}</h3>
          `,
      });

      if (infor) {
        console.log("Notification-service: ", os.hostname)
        console.log("Send mail sucess:: ", infor.messageId);

        await NotificationModel.findOneAndUpdate(
          {
            email: job.email,
          },
          {
            email: job.email,
            $push: {
              notifications: infor.messageId,
            },
          },
          {
            new: true,
            upsert: true,
          }
        );
      }
    } catch (err) {
      console.error(err);
    }
  };

  public static getAllMail = async(req: Request, res: Response, next: NextFunction): Promise<any> => {
    try{
      const {email} = req.body;
      if(email){
        const mailer = await NotificationModel.findOne({email});
        if(mailer){
          console.log("Notification-service: ", os.hostname)
          return mailer;
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
