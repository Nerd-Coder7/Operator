import express from "express";
import {
  getSingleUser,
  getUser,
  loginUser,
  logout,
  registerUser,
  updateUserInfo,
  updateUserWallet,
  verifyEmail
} from "../../controllers/user/user.controller.js";
import isAuthenticated from "../../middlewares/auth.mjs";
import upload from "../../utils/multer.mjs";

export const userRouter = express.Router();
userRouter.post("/register",upload.single("image"),registerUser);
userRouter.get("/activate", verifyEmail);
userRouter.post("/login", loginUser);
userRouter.post("/logout", logout);
userRouter.get("/getuser", isAuthenticated, getUser);
userRouter.put("/update-wallet", isAuthenticated, updateUserWallet);
userRouter.get("/getuser/:id", isAuthenticated, getSingleUser);
userRouter.put("/update-user",upload.single("image"), isAuthenticated, updateUserInfo);
