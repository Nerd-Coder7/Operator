import fs from "fs";
import jwt from "jsonwebtoken";
import path from "path";
import { catchAsyncError } from "../../middlewares/catchAsyncError.mjs";
import User from "../../models/user.model.mjs";
import { createActivationToken } from "../../utils/activationToken.mjs";
import { ErrorHandler } from "../../utils/ErrorHandler.mjs";
import sendToken from "../../utils/jwtToken.mjs";
import sendActivationEmail from "../../utils/sendMail.mjs";

const registerUser = catchAsyncError(async (req, res, next) => {
  try {
    const { email } = req.body;
    let existingUser = await User.findOne({ email: email });

    if (existingUser) {
      const filename = req.file.filename;
      const filePath = `utils/uploads/${filename}`;
      fs.unlink(filePath, (err) => {
        if (err) {
          console.log(err);
          return next(new ErrorHandler("Error deleting file!", 400));
        }
      });
      return next(new ErrorHandler("Email already exists", 400));
    }
    const filename = req.file.filename;
    const fileUrl = path.join(filename);
    const userObj = { ...req.body, image: fileUrl };
    userObj.role = userObj.role.toLowerCase();
    if (userObj.role === "operator") {
      const createUser = await User.create({
        ...userObj,
        OoperatorData: userObj,
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

export {
  getSingleUser,
  getUser,
  loginUser,
  logout,
  registerUser,
  updateUserInfo,
  verifyEmail,
  updateUserWallet,
};
