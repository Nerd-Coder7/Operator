import { catchAsyncError } from "../middlewares/catchAsyncError.mjs";
import Messages from "../models/message.model.mjs";
import path from  "path";
import { ErrorHandler } from "../utils/ErrorHandler.mjs";

// create new message
// router.post(
//   "/create-new-message",
//   upload.single("images"),

export const createMessage = catchAsyncError(async (req, res, next) => {
  try {
    const messageData = req.body;

    if (req.files) {
      const filenames = req.files.map(file => path.join(file.filename));
      messageData.images = filenames;
    }

    messageData.conversationId = req.body.conversationId;
    messageData.sender = req.body.sender;
    messageData.text = req.body.text;

console.log(messageData.images,"IMAGES")

    const message = new Messages({
      conversationId: messageData.conversationId,
      text: messageData.text,
      sender: messageData.sender,
      images: messageData.images ? messageData.images : undefined,
    });

    await message.save();

    res.status(201).json({
      success: true,
      message,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler(err.message, 500));
  }
});

export const getAllMessages = catchAsyncError(async (req, res, next) => {
  try {
    const messages = await Messages.find({
      conversationId: req.params.id,
    });

    res.status(201).json({
      success: true,
      messages,
    });
  } catch (err) {
    console.log(err);
    return next(new ErrorHandler(err.message), 500);
  }
});
