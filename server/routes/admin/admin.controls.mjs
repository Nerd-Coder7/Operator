import express from "express";

import { DeleteUser, getAllOperators, updateOperator } from "../../controllers/admin/admin.controls.controller.mjs";
import isAuthenticated, { isAdmin } from "../../middlewares/auth.mjs";
import { getAllAdminConversations } from "../../controllers/conversation.controller.mjs";
import Conversation from "../../models/conversation.model.mjs";
import User from "../../models/user.model.mjs";

export const adminRouter = express.Router();

adminRouter.get("/admin/get-all-operators",isAuthenticated,getAllOperators)
adminRouter.get("/get-all-admin-conversation/:id",isAuthenticated,isAdmin, getAllAdminConversations);
adminRouter.put("/admin/update-operator/:id",isAuthenticated,isAdmin,updateOperator);
adminRouter.delete("/admin/delete-operator/:id", isAuthenticated,isAdmin, DeleteUser);

adminRouter.get("/admin/get-stats",isAuthenticated,isAdmin, async (req, res, next) => {
    try {
        // Find all operators and select their IDs
        const operators = await User.find({ role: 'operator' }).select('_id');
        // const operatorIds = operators.map(operator => operator._id);

        // Find conversations where any of the members are operators
        const conversations = await Conversation.find().select('_id');

        res.status(200).json({
            success: true,
            operators,
            conversations,
        });
    } catch (err) {
        return next(new ErrorHandler(err.message, 500));
    }
});
