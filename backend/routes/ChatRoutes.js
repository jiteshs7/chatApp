const express = require("express");
const chatController = require("../controllers/ChatController");
const isAuth = require("../middleware/isAuth");

const router = express.Router();
// define the home page route
// Get: /chats/
router.get("/", isAuth, chatController.getChats);
// Get: /chats/:id
router.get("/:id", isAuth, chatController.getChats);

// Post: /chats/
router.post("/", isAuth, chatController.accessChats);
// Post: /chats/createGroup
router.post("/createGroup", isAuth, chatController.createGroup);

// Put: /chats/updateGroup
router.put("/updateGroup", isAuth, chatController.updateGroup);

// Put: /chats/removeGroupUser
router.put("/removeGroupUser", isAuth, chatController.removeFromGroupUser);

// Put: /chats/group
router.put("/addGroupUser", isAuth, chatController.addToGroupUser);

// router.post("/upload-image", chatController.uploadImage);

module.exports = router;
