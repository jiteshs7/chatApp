const jwt = require("jsonwebtoken");

const User = require("../models/User");
const sendError = require("../utils/sendError");

const isAuth = async (req, res, next) => {
  const authrization = req.headers["access-token"];
  if (authrization && authrization.startsWith("Bearer")) {
    try {
      const authToken = authrization.split(" ")[1];

      const decoded = jwt.verify(authToken, process.env.SECRET_KEY);

      req.user = await User.findOne({ email: decoded.email }).select(
        "-password"
      ); // To return data without password
      if (!authToken || !req.user) {
        return next(sendError(401, "User not authorized!"));
      }
      return next();
    } catch (error) {
      console.log("isAuth ERROR", error);

      next(sendError(500, "Somehing went wrong!"));
    }
  }
  next(sendError());
};

module.exports = isAuth;
