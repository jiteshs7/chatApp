const sendError = require("../utils/sendError");

const Chat = require("../models/Chat");
const User = require("../models/User");

// /chats/
exports.getChats = async (req, res, next) => {
  try {
    let result = await Chat.find({
      users: { $elemMatch: { $eq: req.user._id } },
    })
      .populate("users", "-password")
      .populate("latestMessage")
      .populate("groupAdmin", "-password")
      .sort({ updatedAt: -1 });

    result = await User.populate(result, {
      path: "latestMessage.sender",
      select: "name profilePic email",
    });
    return res.status(200).send({ message: "All Chats sent!", data: result });
  } catch (error) {
    console.log("ChatController.js getChats() Error=", error);
    next(sendError());
  }
};

// chats/

exports.accessChats = async (req, res, next) => {
  const { userId } = req.body;
  if (!userId) {
    next(sendError(422, "Please send userId along with request."));
  }

  var isChat = await Chat.find({
    isGroupChat: false,
    $and: [
      { users: { $elemMatch: { $eq: req.user._id } } },
      { users: { $elemMatch: { $eq: userId } } },
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage");

  isChat = await User.populate(isChat, {
    path: "latestMessage.sender",
    select: "name profilePic email",
  });

  if (isChat.length > 0) {
    res.status(200).send(isChat[0]);
  } else {
    let chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    try {
      const createdChat = await Chat.create(chatData);

      const fullChat = await Chat.findOne({ _id: createdChat._id }).populate(
        "users",
        "-password"
      );

      return res.status(200).send({ message: "Successfull!", data: fullChat });
    } catch (error) {
      console.log("ChatController.js accessChats() Error=", error);
      next(sendError());
    }
  }
};

// chats/createGroup
exports.createGroup = async (req, res, next) => {
  const { users, name } = req.body;

  if (!users || !name) {
    return next(sendError(422, "Please send all required fields."));
  }

  const allUsers = JSON.parse(users);

  if (allUsers.length < 2) {
    return next(
      sendError(422, "More than 2 users are required to create a group.")
    );
  }

  allUsers.push(req.user._id);

  try {
    const result = await Chat.create({
      chatName: name,
      isGroupChat: true,
      users: allUsers,
      groupAdmin: req.user._id,
    });

    const groupInfo = await Chat.findOne({ _id: result._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    return res.status(200).send({ message: "Group created!", data: groupInfo });
  } catch (error) {
    console.log("ChatController.js createGroup() Error=", error);
    next(sendError());
  }
};

// chats/updateGroup
exports.updateGroup = async (req, res, next) => {
  const { chatId, chatName } = req.body;
  try {
    const result = await Chat.findByIdAndUpdate(
      chatId,
      { chatName },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!result) {
      return next(sendError(404, "Chat not found!"));
    }
    return res.status(200).send({ message: "Group updated!", data: result });
  } catch (error) {
    console.log("ChatController.js updateGroup() Error=", error);
    next(sendError());
  }
};

// chats/removeGroupUser
exports.removeFromGroupUser = async (req, res, next) => {
  const { userId, chatId } = req.body;
  try {
    const result = await Chat.findByIdAndUpdate(
      chatId,
      {
        isGroupChat: true,
        $pull: { users: userId },
        $and: [
          { groupAdmin: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: req.user } } },
        ],
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!result) {
      return next(sendError(404, "Chat not found!"));
    }
    return res.status(200).send({ message: "User removed!", data: result });
  } catch (error) {
    console.log("ChatController.js removeGroupUser() Error=", error);
    next(sendError());
  }
};

// chats/addGroupUser
exports.addToGroupUser = async (req, res, next) => {
  const { userId, chatId } = req.body;

  try {
    const result = await Chat.findByIdAndUpdate(
      chatId,
      {
        isGroupChat: true,
        $push: { users: userId },
        $and: [
          { groupAdmin: { $elemMatch: { $eq: req.user._id } } },
          { users: { $elemMatch: { $eq: userId } } },
        ],
      },
      { new: true }
    )
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    if (!result) {
      return next(sendError(404, "Chat not found!"));
    }
    return res.status(200).send({ message: "User added!", data: result });
  } catch (error) {
    console.log("ChatController.js addGroupUser() Error=", error);
    next(sendError());
  }
};

exports.uploadImage = (req, res, next) => {
  if (!req.file) {
    return res.status(404).json({ message: "No file provided!" });
  }
  return res
    .status(201)
    .json({ message: "File stored!", filePath: req.file.path });
};
