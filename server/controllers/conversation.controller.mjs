import { catchAsyncError } from "../middlewares/catchAsyncError.mjs";
import Conversation from "../models/conversation.model.mjs";
import { ErrorHandler } from "../utils/ErrorHandler.mjs";

export const getAllConversation = catchAsyncError(async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
      members: {
        $in: [req.params.id],
      },
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(201).json({
      success: true,
      conversations,
    });
  } catch (error) {
    return next(new ErrorHandler(error), 500);
  }
});
export const getAllAdminConversations = catchAsyncError(async (req, res, next) => {
  try {
    const conversations = await Conversation.find({
    }).sort({ updatedAt: -1, createdAt: -1 });

    res.status(201).json({
      success: true,
      conversations,
    });
  } catch (error) {
    return next(new ErrorHandler(error), 500);
  }
});

export const createNewConversation = catchAsyncError(async (req, res, next) => {
  try {
    const { groupTitle, userId, operatorId } = req.body;

    const isConversationExist = await Conversation.findOne({ groupTitle });

    if (isConversationExist) {
      const conversation = isConversationExist;
      res.status(201).json({
        success: true,
        conversation,
      });
    } else {
      const conversation = await Conversation.create({
        members: [userId, operatorId],
        groupTitle: groupTitle,
      });

      res.status(201).json({
        success: true,
        conversation,
      });
    }
  } catch (error) {
    return next(new ErrorHandler(error.message), 500);
  }
});

export const updateConversation =  catchAsyncError(async (req, res, next) => {
  try {
    const { lastMessage, lastMessageId } = req.body;

    const conversation = await Conversation.findByIdAndUpdate(req.params.id, {
      lastMessage,
      lastMessageId,
    });

    res.status(200).json({
      success: true,
      conversation,
    });
  } catch (error) {
    return next(new ErrorHandler(error), 500);
  }
})
