import mongoose from "mongoose";

const chatSessionSchema = new mongoose.Schema(
  {
    sender: {
      type: String,
    },
    reciever: {
      type: String,
      required: true
    },
    minutes: {
      type: Number,
    },
  },
  { timestamps: true }
);

const ChatSession = mongoose.model("chatSession", chatSessionSchema);
export default ChatSession;