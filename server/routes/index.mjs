import express from "express";
import { userRouter } from "./auth/user.route.mjs";
import { chatRouter } from "./message.route.mjs";
import { adminRouter } from "./admin/admin.controls.mjs";
import { paymentRouter } from "./payment/payment.route.mjs";
import { sessionRouter } from "./chat.session.model.mjs";

export const allRouter = express.Router();

allRouter.use("/user", userRouter, adminRouter);
allRouter.use("/chat", chatRouter);
allRouter.use("/payment",paymentRouter)
allRouter.use("/session",sessionRouter)

