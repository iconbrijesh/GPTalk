import User from "../models/user.js";
import { ApiResponse } from "../utils/api-response.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { ExpressError } from "../utils/ExpressError.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import crypto from 'crypto'; // ✅ Correct for ESM

import {
  emailVerificationMailgenContent,
  
  sendEmail,
} from "../utils/mail.js";

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();

    user.refreshToken = refreshToken;
    await user.save({ validateBeforeSave: false });
    return { accessToken, refreshToken };
  } catch (error) {
    throw new ExpressError(
      500,
      "Something went wrong while generating access token",
    );
  }
};

const registerUser = wrapAsync(async (req, res) => {
  const { email, username, password } = req.body;

  const existedUser = await User.findOne({
    $or: [{ username }, { email }]
  });

  if (existedUser) {
    throw new ExpressError(409, "User with email or username already exists");
  }

  const user = await User.create({
    email,
    password,
    username,
    isEmailVerified: false
  });

  const { unHashedToken, hashedToken, tokenExpiry } = user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;
  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/verify-email/${unHashedToken}`
    )
  });

  const createdUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  return res.status(201).json(
  new ApiResponse(
    201,
    {
      user: createdUser,
      isEmailVerified: false, // ✅ Explicitly include this
    },
    "User registered successfully. Please verify your email."
  )
);
});


const login = wrapAsync(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new ExpressError(400, "Email and password are required");
  }

  const user = await User.findOne({ email });
  if (!user) {
    throw new ExpressError(400, "User not found");
  }

  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new ExpressError(400, "Incorrect password");
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshTokens(user._id);

  const loggedInUser = await User.findById(user._id).select(
    "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
  );

  const options = {
    httpOnly: true,
    secure: true
  };

  res
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options);

 return res.status(200).json(
  new ApiResponse(
    200,
    {
      accessToken,
      refreshToken,
      user: loggedInUser,
      isEmailVerified: user.isEmailVerified, // ✅ Add this line
    },
    "User logged in successfully"
  )
);
});

const logoutUser = wrapAsync(async(req, res)=>{
  await User.findByIdAndUpdate(
    req.user._id,
    {
      $set:{
        refreshToken: "",
      }
    },
    {
      new: true,
    }
  );
  const options ={
    httpOnly: true,
    // secure: true
  }

  return res 
  .status(200)
  .clearCookie("accessToken", options)
  .clearCookie("refreshToken", options)
  .json(
    new ApiResponse(200, {}, "User logged out")
  )

});

const getCurrentUser = wrapAsync(async (req, res) => {
  return res
    .status(200)
    .json(new ApiResponse(200, req.user, "Current user fetched successfully"));
});

const verifyEmail = wrapAsync(async (req, res) => {
  const { verificationToken } = req.params;

  if (!verificationToken) {
    throw new ExpressError(400, "Email verification token is missing");
  }

  let hashedToken = crypto
    .createHash("sha256")
    .update(verificationToken)
    .digest("hex");

  const user = await User.findOne({
    emailVerificationToken: hashedToken,
    emailVerificationExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ExpressError(400, "Token is invalid or expired");
  }

  user.emailVerificationToken = undefined;
  user.emailVerificationExpiry = undefined;

  user.isEmailVerified = true;
  await user.save({ validateBeforeSave: false });

  return res.status(200).json(
    new ApiResponse(
      200,
      {
        isEmailVerified: true,
      },
      "Email is verified",
    ),
  );
});



const resendEmailVerification = wrapAsync(async (req, res) => {
  const user = await User.findById(req.user?._id);

  if (!user) {
    throw new ExpressError(404, "User does not exist");
  }
  if (user.isEmailVerified) {
    throw new ExpressError(409, "Email is already verified");
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.emailVerificationToken = hashedToken;
  user.emailVerificationExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Please verify your email",
    mailgenContent: emailVerificationMailgenContent(
      user.username,
      `${req.protocol}://${req.get("host")}/api/v1/users/verify-email/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Mail has been sent to your email ID"));
});



const refreshAccessToken = wrapAsync(async (req, res) => {
  const incomingRefreshToken =
    req.cookies.refreshToken || req.body.refreshToken;

  if (!incomingRefreshToken) {
    throw new ExpressError(401, "Unauthorized access");
  }

  try {
    const decodedToken = jwt.verify(
      incomingRefreshToken,
      process.env.REFRESH_TOKEN_SECRET,
    );

    const user = await User.findById(decodedToken?._id);
    if (!user) {
      throw new ExpressError(401, "Invalid refresh token");
    }

    if (incomingRefreshToken !== user?.refreshToken) {
      throw new ExpressError(401, "Refresh token in expired");
    }

    const options = {
      httpOnly: true,
      secure: true,
    };

    const { accessToken, refreshToken: newRefreshToken } =
      await generateAccessAndRefreshTokens(user._id);

    user.refreshToken = newRefreshToken;
    await user.save();

    return res
      .status(200)
      .cookie("accessToken", accessToken, options)
      .cookie("refreshToken", newRefreshToken, options)
      .json(
        new ApiResponse(
          200,
          { accessToken, refreshToken: newRefreshToken },
          "Access token refreshed",
        ),
      );
  } catch (error) {
    throw new ExpressError(401, "Invalid refresh token");
  }
});



const forgotPasswordRequest = wrapAsync(async (req, res) => {
  const { email } = req.body;

  const user = await User.findOne({ email });

  if (!user) {
    throw new ExpressError(404, "User does not exists", []);
  }

  const { unHashedToken, hashedToken, tokenExpiry } =
    user.generateTemporaryToken();

  user.forgotPasswordToken = hashedToken;
  user.forgotPasswordExpiry = tokenExpiry;

  await user.save({ validateBeforeSave: false });

  await sendEmail({
    email: user?.email,
    subject: "Password reset request",
    mailgenContent: forgotPasswordMailgenContent(
      user.username,
      `${process.env.FORGOT_PASSWORD_REDIRECT_URL}/${unHashedToken}`,
    ),
  });

  return res
    .status(200)
    .json(
      new ApiResponse(
        200,
        {},
        "Password reset mail has been sent on your mail id",
      ),
    );
});


const resetForgotPassword = wrapAsync(async (req, res) => {
  const { resetToken } = req.params;
  const { newPassword } = req.body;

  let hashedToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  const user = await User.findOne({
    forgotPasswordToken: hashedToken,
    forgotPasswordExpiry: { $gt: Date.now() },
  });

  if (!user) {
    throw new ExpressError(489, "Token is invalid or expired");
  }

  user.forgotPasswordExpiry = undefined;
  user.forgotPasswordToken = undefined;

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password reset successfully"));
});

const changeCurrentPassword = wrapAsync(async (req, res) => {
  const { oldPassword, newPassword } = req.body;

  const user = await User.findById(req.user?._id);

  const isPasswordValid = await user.isPasswordCorrect(oldPassword);

  if (!isPasswordValid) {
    throw new ExpressError(400, "Invalid old Password");
  }

  user.password = newPassword;
  await user.save({ validateBeforeSave: false });

  return res
    .status(200)
    .json(new ApiResponse(200, {}, "Password changed successfully"));
});


export { registerUser, login, logoutUser, getCurrentUser,  verifyEmail,resendEmailVerification,refreshAccessToken, forgotPasswordRequest,resetForgotPassword, changeCurrentPassword};