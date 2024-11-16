import mongoose from "mongoose";

const messageSchema = new mongoose.Schema({
    senderId: { // Fixed the field name to match with the rest of the code
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    receiverId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    message: {
        type: String,
        required: true
    }
}, { timestamps: true });

const Message = mongoose.model("Message", messageSchema);

export default Message;
