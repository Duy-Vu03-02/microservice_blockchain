import mongoose, { Schema } from "mongoose";
import { values } from "lodash";
import { UserRole } from "@common/auth/auth";

export interface IUser extends Document {
  _id: Schema.Types.ObjectId;
  name: String;
  role: UserRole;
  account: String;
  password: String;

  transform(): IUserReponse;
}

export interface IUserRegister {
  account: string;
  name: string;
  password: string;
  role: UserRole;
}

export interface IUserReponse {
  id: string;
  name: string;
  role: UserRole;
}

const UserSchema = new Schema<IUser>({
  name: { type: String },
  account: { type: String },
  password: { type: String },
  role: { type: String, enum: values(UserRole) },
});

UserSchema.method({
  transform(): IUserReponse {
    const tranfomed: IUserReponse = {
      id: this._id.toHexString(),
      name: this.name ?? undefined,
      role: this.role ?? undefined,
    };
    return tranfomed;
  },
});

export const UserModel = mongoose.model<IUser>("User", UserSchema);
