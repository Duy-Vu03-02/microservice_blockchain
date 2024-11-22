import mongoose from "mongoose";
import * as dotenv from "dotenv";
dotenv.config();

export class DatabaseAdapter {
  private static urlConnection: string = process.env.URL_MONGO;
  
  public static connection = async () => {
    try {
      await mongoose.connect(DatabaseAdapter.urlConnection, {});
      console.log("ConnectDB:: Success");
    } catch (err) {
      console.log("ConnectDB:: Faild");
      console.error(err);
    }
  };
}
