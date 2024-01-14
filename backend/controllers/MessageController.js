const Chat = require("../models/Chat");
const Message = require("../models/Message");
const User = require("../models/User");

const sendError = require("../utils/sendError");

exports.sendMessage = async (req, res, next) => {
  const { content, chatId } = req.body;
  if (!content || !chatId) {
    return res.status(400).send("Invalid data found!");
  }

  const newMessage = {
    sender: req.user._id,
    content,
    chat: chatId,
  };

  try {
    let message = await Message.create(newMessage);

    message = await message.populate("sender", "name profilePic");

    message = await message.populate("chat");

    message = await User.populate(message, {
      path: "chat.users",
      select: "name profilePic email",
    });

    await Chat.findByIdAndUpdate(chatId, {
      latestMessage: message,
    });

    res.status(200).send({ message: "Success", data: message });
  } catch (error) {
    console.log("MessagesController.js sendMessage Error=", error);
    next(sendError(400, error?.message || error));
  }
};

exports.getAllMessages = async (req, res, next) => {
  const { chatId } = req.params;

  if (!chatId) return next(sendError(404, "Chat id not found!"));
  try {
    const result = await Message.find({ chat: chatId })
      .populate("sender", "name email profilePic")
      .populate("chat");

    res.status(200).send({ message: "Messages fetched!", data: result });
  } catch (error) {
    console.log("MessagesController.js getAllMessages Error=", error);
    next(sendError(400, error?.message || error));
  }
};
