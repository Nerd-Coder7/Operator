import { catchAsyncError } from "../../middlewares/catchAsyncError.mjs";
import User from "../../models/user.model.mjs";

const getAllOperators = catchAsyncError(async (req, res, next) => {
  try {
    const operators = await User.find({ role: "operator" });
    res.status(200).send({
      success: true,
      message: "Operators fetched successfully",
      data: operators,
    });
  } catch (err) {
    next(err);
  }
});


const updateOperator = catchAsyncError(async (req, res, next) => {
  try {
    const {_id,...other}=req.body;
    const {pricingPerMinute,webiste,...all}=other;
   const user= await User.findByIdAndUpdate({ _id: req.params.id },{...all},{new:true});
  if(pricingPerMinute) user.operatorData.pricingPerMinute=pricingPerMinute;
  if(webiste) user.operatorData.website=webiste;
   await user.save();
    res.status(200).send({
      success: true,
      message: "Operator updated successfully",
    });
  } catch (err) {
    next(err);
  }
});

const DeleteUser = catchAsyncError(async (req, res, next) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);

    if (!user) {
      return next(new ErrorHandler("User doesn't exists", 400));
    }
    res.status(200).json({
      success: true,
      message: "User deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 500));
  }
});

export { getAllOperators,updateOperator,DeleteUser };
