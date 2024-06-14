// Create token and saving the in cookies and send response

const sendToken = async(user, statusCode, res, type) => {
    const token = user.getJwtToken();
  
    // Options for cookies
    const options = {
      expires: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
      httpOnly: true,
      sameSite: "none",
      secure: true,
    };
  user.loggedIn="Online";
  await user.save();
    res.status(statusCode).cookie(type, token, options).json({
      success: true,
      redirect:user.role.toLowerCase()==="admin"?"/":user.role.toLowerCase()==="user"?"/all-operators":"/chat",
    message:"Logged in successfully"
    });
  };
export default sendToken;