const User = require("../models/User");

const sendError = require("../utils/sendError");

const { generateToken } = require("../utils/generateToken");
const { EMAIL_REGEX, USER_STATUS } = require("../shared/Constants");

exports.login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(sendError(422, "Please enter all required fields."));
  }

  if (!EMAIL_REGEX.test(email)) {
    return next(sendError(422, "Please enter valid email address."));
  }

  if (password.length < 6) {
    return next(sendError(422, "Password must be atleast 6 characters long."));
  }

  try {
    const user = await User.findOne({ email });
    if (user) {
      // const isCorrect = await bcrypt.compare(password, user.password);
      const isCorrect = await user.matchPassword(password);
      if (!isCorrect) {
        return next(sendError(422, "Invalid email or password"));
      }

      const token = generateToken(user.email, user.password);

      return res.status(200).json({
        message: "User logged in!",
        data: {
          email: user.email,
          name: user.name,
          profilePic: user.profilePic,
          status: user.status,
          token,
          _id: user._id,
        },
      });
    } else {
      return next(sendError(404, "User not found!"));
    }
  } catch (error) {
    console.log("UserController.js login() Error=", error);
    next(sendError(504, error));
  }
};

exports.signup = async (req, res, next) => {
  const { name, email = "", password, profilePic } = req.body;

  if (!name || !email || !password) {
    return next(sendError(422, "Please enter all required fields."));
  }

  if (!EMAIL_REGEX.test(email)) {
    return next(sendError(422, "Please enter valid email address."));
  }

  if (password.length < 6) {
    return next(sendError(422, "Password must be atleast 6 characters long."));
  }

  const user = await User.findOne({ email });

  if (user) return next(sendError(422, "User already exists!"));

  User.create({
    name,
    email,
    password,
    profilePic,
    status: USER_STATUS.ACTIVE,
  })
    .then((userData) => {
      const token = generateToken(userData.email, userData.password);

      res.status(201).json({
        message: "User created!",
        data: {
          email: userData.email,
          name: userData.name,
          profilePic: userData.profilePic,
          status: userData.status,
          _id: userData._id,
          token,
        },
      });
    })
    .catch((err) => {
      console.log("auth.js signup Error=", err);
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(sendError());
    });
};

exports.getAllUsers = async (req, res, next) => {
  // Added AND operator instead of OR
  // because I don't want any result if search doesn't matches

  const keywords = req.query.search
    ? {
        $or: [
          { name: { $regex: req.query.search, $options: "i" } },
          { email: { $regex: req.query.search, $options: "i" } },
        ],
      }
    : {};
  try {
    const users = await User.find(keywords).find({
      _id: { $ne: req.user._id },
    });
    res.status(200).send(users);
  } catch (error) {
    console.log("userController.js getAllUsers() error=", error);
    next(sendError(422, error));
  }
};
