import express from "express";
import {
  getSingleUser,
  getUser,
  getAllUsers,
  loginUser,
  logout,
  registerUser,
  updateUserInfo,
  updateUserWallet,
  userWallet,
  verifyEmail,
  deleteUser
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
userRouter.get("/get-all-users", isAuthenticated, getAllUsers);
userRouter.put("/user-wallet/:id", isAuthenticated, userWallet);
userRouter.delete("/delete-user/:id", isAuthenticated, deleteUser);



