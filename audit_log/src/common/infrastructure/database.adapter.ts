import { URL_MONGO } from "@config/environment";
import mongoose from "mongoose";

export class DatabaseAdapter {
  public static connect = async () => {
    try {
      await mongoose.connect(URL_MONGO, {});
      console.log("Connect DB :: SUCCESS");
    } catch (err) {
      console.error(err.message);
    }
  };
}
