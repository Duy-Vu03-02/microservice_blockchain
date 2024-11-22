import { NotificationController } from "./api/notification.controler";
import mongoose, { Schema } from "mongoose";

const NotificationSchema = new Schema({
  email: { type: String },
  notifications: [{ type: String }],
});

NotificationSchema.method({
  tranformNotification() {
    return {
      id: this._id.toHexString(),
      notification: this.notification.map((item: string) => item),
    };
  },
});

export const NotificationModel = mongoose.model(
  "Notification",
  NotificationSchema
);
