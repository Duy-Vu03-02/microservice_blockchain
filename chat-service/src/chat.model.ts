import mongoose,{Schema} from "mongoose";

const ChatSchema = new Schema({
    member: [{type: String}],
    messages: [
        {
            sender: {type: String},
            message: {type: String},
        }
    ]
});

ChatSchema.method({
    tranform() {
        return {
            id: this._id.toHexString(),
            member: this.member,
            messages: this.messages,
        }
    }
})

export const ChatModel = mongoose.model("Chat", ChatSchema);