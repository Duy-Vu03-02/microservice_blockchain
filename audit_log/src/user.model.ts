import mongoose, { Schema } from "mongoose";

const UserSchema = new Schema({
    email: {type: String},
    messages: [{
        friend_email: {type: String},
        message:{type: String},
    }]
});

export const UserModel = mongoose.model("User", UserSchema);