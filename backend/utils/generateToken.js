const jwt = require("jsonwebtoken");

exports.generateToken = (email, password) => {
  return jwt.sign(
    {
      email,
      password,
    },
    process.env.SECRET_KEY,
    {
      expiresIn: "30d",
    }
  );
};
