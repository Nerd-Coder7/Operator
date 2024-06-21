import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";

const { Schema, model } = mongoose;

const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Define role-specific schemas
const OperatorSchema = new Schema({
 pricingPerMinute:Number,
 website:[String],
 
});


const userDataSchema = new Schema({
  // Candidate specific fields
  wallet:Number
});

// Base User Schema
const UserSchema = new Schema(
  {
    name: {
      type: String,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      validate: [emailRegexPattern, "Please enter a valid email address"],
    },
    password: {
      type: String,
      required: true,
      minlength: 6,
      select: false,
    },
    role: {
      type: String,
      enum: ["operator", "user", "admin"],
      default: "user",
      required: true,
    },
    image:{type:String},
    loggedIn:{type:String,enum:["Online","Offline","Break","Busy"],default: 'Offline'},
    // Role-specific data
    shortDiscription: {type:String},
    userData: userDataSchema,
    operatorData: OperatorSchema,
    isVerified: Boolean,
  },
  { timestamps: true }
);

UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 10);
  next();
});

UserSchema.methods.getJwtToken = function () {
  return jwt.sign({ id: this._id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES,
  });
};

UserSchema.methods.comparePasswords = async function (password) {
  return bcrypt.compare(password, this.password);
};

const User = model("User", UserSchema);
export default User;
