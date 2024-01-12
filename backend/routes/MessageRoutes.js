const express = require("express");

const messageController = require("../controllers/MessageController");
const isAuth = require("../middleware/isAuth");

const router = express.Router();

// define the message route
//POST => /message/
router.post("/", isAuth, messageController.sendMessage);

//GET => /message/:chatId
router.get("/:chatId", isAuth, messageController.getAllMessages);

module.exports = router;
