import express from "express";
import { createNewConversation, getAllConversation, updateConversation } from "../controllers/conversation.controller.mjs";
import { createMessage, getAllMessages } from "../controllers/message.controller.mjs";
import upload from "../utils/multer.mjs";

export const chatRouter = express.Router();

// Conversations :->

chatRouter.post("/create-new-conversation", createNewConversation);
chatRouter.get("/get-all-conversation/:id", getAllConversation);
chatRouter.put("/update-last-message/:id", updateConversation);


// Messages :->

chatRouter.post ("/create-new-message", upload.array("images", 10), createMessage);
chatRouter.get("/get-all-messages/:id", getAllMessages);