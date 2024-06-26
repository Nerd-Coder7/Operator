import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { catchAsyncError } from "../../middlewares/catchAsyncError.mjs";
import User from "../../models/user.model.mjs";
import { createActivationToken } from "../../utils/activationToken.mjs";
import { ErrorHandler } from "../../utils/ErrorHandler.mjs";
import sendToken from "../../utils/jwtToken.mjs";
import sendActivationEmail from "../../utils/sendMail.mjs";
import sendNotifyEmail from "../../utils/sendNotifyMail.mjs";
import { createTemplatePath } from "../../utils/templatePath.mjs";
import bcrypt from "bcryptjs";
const registerUser = catchAsyncError(async (req, res, next) => {
  console.log("registerUser--------------------------------",req.body);
  try {
    const { email } = req.body;
    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const filename = req?.file?.filename;
      if(filename){
 const filePath = `utils/uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          return next(new ErrorHandler("Error deleting file!", 400));
        }
      });
      }     
      return next(new ErrorHandler("Email already exists", 400));
    }
    let userObj;
    if(req.file){
      console.log("sdf")
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
     userObj = { ...req.body, image: fileUrl };
    }else{
       userObj = { ...req.body };
    }
    
    userObj.role = userObj.role.toLowerCase();
    console.log("userObj--",userObj);
    if (userObj.role === "operator") {
      const createUser = await User.create({
        ...userObj,
        operatorData:userObj,
        isVerified: true,
      });
      await createUser.save();
      return res.status(201).send({
        success: true,
        message: "Operator successfully registered",
      });
    }
    const activation = createActivationToken(userObj);
    const activationLink = `${process.env.APP_URL}/auth/verify?token=${activation.token}`;
    const isEmailSent = await sendActivationEmail(
      userObj.email,
      activationLink
    );

    if (isEmailSent) {
      res.status(201).json({
        success: true,
        message: "Please check your mailbox and verify your account!",
      });
    } else {
      next(new ErrorHandler("Email not sent. Please try again!", 400));
    }
  } catch (err) {
    console.log(err,"errorsfsdsd");
    next(err);
  }
});

const verifyEmail = catchAsyncError(async (req, res, next) => {
  try {
    console.log("first");
    const { token } = req.query;
    const user = jwt.verify(token, "shivam");
    if (!token) {
      return next(new ErrorHandler("Invalid token", 400));
    }
    const { iat, exp, ...rest } = user;
    const createUser = await User.create({
      ...rest,
      userData: { ...rest },
      isVerified: true,
    });
    await createUser.save();
    console.log(createUser, "Iio");
    res.status(200).json({
      success: true,
      message: "User created successfully",
      data: createUser,
    });
  } catch (err) {
    next(err);
  }
});

const loginUser = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;
    console.log(req.body);
    if (!email || !password) {
      return next(new ErrorHandler("Please provide the all filelds", 400));
    }
    const user = await User.findOne({ email }).select("+password");
    // +password is used to select the password field from the database

    if (!user) {
      return next(new ErrorHandler("user doesn't exits", 400));
    }

    // compare password with database password
    const isPasswordValid = await user.comparePasswords(password);

    if (!isPasswordValid) {
      return next(
        new ErrorHandler("Please provide the correct informations", 400)
      );
    }
    sendToken(user, 200, res, "support_token");
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getUser = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }
    console.log("User: " + user);
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const getAllUsers = catchAsyncError(async (req, res, next) => {
  try {
    const users = await User.find({role:'user'});
    if (!users) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});
const getSingleUser = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findById(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const logout = catchAsyncError(async (req, res, next) => {
  try {
    res.cookie("support_token", null, {
      expires: new Date(Date.now()),
      httpOnly: true,
    });
    res.status(201).json({
      success: true,
      message: "Log out successful!",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

const updateUserInfo = catchAsyncError(async (req, res, next) => {
  console.log("--- req.body--", req.body);
  const { name, password, loggedIn } = req.body;

  try {
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user && req.body.oldImage && user.image) {
      const filePath = `utils/uploads/${req.body.oldImage}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          return next(new ErrorHandler("Error deleting file!", 400));
        }
      });
    }

    if (req.file) {
      const filename = req.file.filename;
      const fileUrl = path.join(filename);
      console.log(fileUrl);
      user.image = fileUrl;
    }
    console.log(user);
    if (name) user.name = name;
    if (loggedIn) user.loggedIn = loggedIn;
    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({ message: "User updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
});

const updateUserWallet = catchAsyncError(async (req, res, next) => {
  const { operatorID } = req.body;

  try {
    const operator = await User.findById(operatorID);
    const user = await User.findOne({ email: req.user.email });

    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }

    if (!operator) {
      return next(new ErrorHandler("Operator not found", 404));
    }

    if (user && user.userData && operator.operatorData) {
      const deductionAmount = operator.operatorData.pricingPerMinute;
      const currentBalance = user.userData.wallet;

      if (currentBalance < deductionAmount) {
        return next(new ErrorHandler("Balance is low, please recharge", 400));
      }

      user.userData.wallet -= deductionAmount;

      await user.save();

      return res.status(200).json({ message: "User updated successfully" });
    } else {
      return res
        .status(400)
        .json({ message: "Incomplete user or operator data" });
    }
  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});
const userWallet = catchAsyncError(async (req, res, next) => {
console.log("req.body");
  const userId = req.params.id
  const userData = {
    wallet : Number(req.body.userData.wallet)
  }
  const updateData = {
    name:req.body.name,
    email:req.body.email,
    role:req.body.role,
    image:req.body.image,
    loggedIn: req.body.loggedIn,
    userData:userData
  }
  try {

    const user= await User.findByIdAndUpdate({ _id: userId },updateData,{new:true});

    return res
    .status(200)
    .json({ message: "Incomplete user or operator data", data: user });

  } catch (err) {
    return next(new ErrorHandler(err.message, 500));
  }
});

const deleteUser = catchAsyncError(async (req, res, next) => {
  console.log("req.body", req.params.id);
    const userId = req.params.id
    try {
  
      const user= await User.findByIdAndDelete(userId);
      console.log("user---",user);
      return res
      .status(200)
      .json({ message: "Incomplete user or operator data", data: user });
  
    } catch (err) {
      return next(new ErrorHandler(err.message, 500));
    }
  });


  const forgotPassword = catchAsyncError(async (req, res, next) => {
    console.log("REQ", req.body)
    try {
      const { email } = req.body;
      const user = await User.findOne({ email: email });
      if (!user) {
        return next(new ErrorHandler("There's no account by this email.", 400));
      }
      const activation = createActivationToken(req.body);

      const redirectLink = `${process.env.APP_URL}/change-password?token=${activation.token}`;
  
      const templatePath = createTemplatePath("mails/update_pass_mail.ejs");
      await sendNotifyEmail(email, templatePath, redirectLink, "Change Password");
  
      res.status(200).json({
        success: true,
        message: "Confirmation mail sent on your e-mail. Please verify it!",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

  const changePassword = catchAsyncError(async (req, res, next) => {
    try {
      const { token } = req.body;
      const { password } = req.body;
      const updated = await bcrypt.hash(password, 10);
      if (!token) {
        return next(new ErrorHandler("Invalid token", 400));
      }
      const user = jwt.verify(token, "shivam");
      const update = await User.findOneAndUpdate(
        { email: user.email },
        { password: updated },
        { new: true }
      );
  
      res.status(200).json({
        success: true,
        message: "Your password has been updated",
      });
    } catch (error) {
      return next(new ErrorHandler(error.message, 500));
    }
  });

export {
  getSingleUser,
  getUser,
  getAllUsers,
  loginUser,
  logout,
  registerUser,
  updateUserInfo,
  verifyEmail,
  updateUserWallet,
  userWallet,
  deleteUser,
  forgotPassword,
  changePassword
};
