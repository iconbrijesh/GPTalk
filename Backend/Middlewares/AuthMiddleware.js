import jwt from "jsonwebtoken";
import User from "../models/user.js";
import { ApiResponse } from "../utils/api-response.js";
import { wrapAsync } from "../utils/wrapAsync.js";
import { ExpressError } from "../utils/ExpressError.js";

export const verifyJWT = wrapAsync(async (req, res, next) => {
  const token =
    req.cookies?.accessToken ||
    req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    throw new ExpressError(401, "Unauthorized request");
  }

  try {
    const decodedToken = jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);

    if (!decodedToken?._id) {
      throw new ExpressError(401, "Invalid token payload");
    }

    const user = await User.findById(decodedToken._id).select(
      "-password -refreshToken -emailVerificationToken -emailVerificationExpiry"
    );

    if (!user) {
      throw new ExpressError(401, "Invalid access token");
    }

    if (!user.isEmailVerified) {
      throw new ExpressError(403, "Please verify your email to access this resource");
    }

    req.user = user;
    next();
  } catch (error) {
  if (error.name === "TokenExpiredError") {
    throw new ExpressError(401, "Access token expired");
  }
  if (error.name === "JsonWebTokenError") {
    throw new ExpressError(401, "Malformed access token");
  }
  throw new ExpressError(401, "Invalid access token");
}
});