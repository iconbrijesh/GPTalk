const User = require("../models/user.js");
require("dotenv").config();
const jwt = require("jsonwebtoken");

module.exports.userVerification = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    if (!token) return res.json({ status: false });

    // verify token
    const decoded = jwt.verify(token, process.env.TOKEN_KEY);

    // find user
    const user = await User.findById(decoded.id);
    if (!user) return res.json({ status: false });

    // attach user info to req for further use
    req.user = user;
    next(); // ✅ call next so this works as middleware
  } catch (err) {
    return res.json({ status: false });
  }
};
