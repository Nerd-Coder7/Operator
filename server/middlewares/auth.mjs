import User from "../models/user.model.mjs";
import { ErrorHandler } from "../utils/ErrorHandler.mjs";
import jwt from "jsonwebtoken";
import { catchAsyncError } from "./catchAsyncError.mjs";
const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const { support_token: token } = req.cookies;
  if (!token) {
    return next(new ErrorHandler("Please login to continue", 401));
  }
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  req.user = await User.findById(decoded.id);
  next();
});

export default isAuthenticated;

export const isAdmin = catchAsyncError(async (req, res, next) => {
const {role} = req.user;
if(role!=="admin"){
  return next(new ErrorHandler("You're not authorized", 401));
}
next();

});