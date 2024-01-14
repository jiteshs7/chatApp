const express = require("express");

const userController = require("../controllers/UserController");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

// define the home page route
//POST => /user/login
router.post("/login", userController.login);
//POST => /user/singup
router.post("/signup", userController.signup);

// GET => /user/users
router.get("/users", isAuth, userController.getAllUsers);
module.exports = router;
