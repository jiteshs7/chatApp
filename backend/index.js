const express = require("express");
const path = require("path");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const multer = require("multer");
const dotenv = require("dotenv");

const chatRoutes = require("./routes/ChatRoutes");
const userRoutes = require("./routes/UserRoutes");
const messageRoutes = require("./routes/MessageRoutes");

const { notFound, errorHandler } = require("./middleware/ErrorHandler");

const app = express();
dotenv.config();
// Define the maximum size for uploading
// picture i.e. 1 MB. it is optional
const maxSize = 1 * 1000 * 1000;

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "images");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().toISOString() + "-" + file.originalname);
  },
});

const handleFileFilteration = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

app.use(bodyParser.json()); //application/json

app.use("/images", express.static(path.join(__dirname, "images"))); //Here we'll tell express that our required file is in images folder

app.use(
  multer({
    // dest: "images"
    limits: { fileSize: maxSize },
    storage: fileStorage,
    fileFilter: handleFileFilteration,
  }).single("image")
);

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PUT, PATCH, DELETE"
  );
  // res.setHeader("Access-Control-Allow-Headers", "Content-Type, Authorization");
  // Request headers you wish to allow
  res.setHeader(
    "Access-Control-Allow-Headers",
    "X-Requested-With,content-type,search,access-token"
  );

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  // res.setHeader("Access-Control-Allow-Credentials", true);

  // if (req.method === "OPTIONS") return;
  next();
});

app.post("/upload-image", (req, res, next) => {
  if (!req.file) {
    return res.status(404).json({ message: "No file provided!" });
  }

  return res
    .status(201)
    .json({ message: "File stored!", filePath: req.file.path });
});

//-----------------DEPLOYEMENT----------------
const __dirname1 = path.resolve();

app.use("/chats", chatRoutes);
app.use("/user", userRoutes);
app.use("/message", messageRoutes);

if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname1, "../frontend/build")));

  app.get("*", (req, res, next) => {
    try {
      res.sendFile(path.resolve(__dirname1, "frontend", "build", "index.html"));
    } catch (error) {
      console.log("ERROR", error);
      next(error);
    }
  });
} else {
  app.use("/", (req, res) => {
    res.send(`API is running on...${process.env.NODE_ENV}`);
  });
}

app.use(notFound);
app.use(errorHandler);

const server = app.listen(
  { port: process.env.PORT || 8080 },
  console.log(`Server started on port ${process.env.PORT}`)
);

mongoose
  .connect(process.env.MONGODB_URI, {
    // useNewUrlParser: true,
    // useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB connected!!");
    const io = require("socket.io")(server, {
      pingTimeout: 60000, // It will take 60s to close the connection and to save the bandwidth
      cors: {
        origin: "http://localhost:3000",
      },
    });

    io.on("connection", (socket) => {
      console.log("Connected to socket.io");

      socket.on("setup", (userData) => {
        socket.join(userData._id); // This will create a new room for particular user
        socket.emit("connected");
      });

      socket.on("join_chat", (room) => {
        socket.join(room); // This will create a new room for particular user
      });

      socket.on("typing", (room, userId) => {
        socket.in(room).emit("typing", userId);
      });
      socket.on("stop_typing", (room) => socket.in(room).emit("stop_typing"));

      socket.on("new_message", (msgData) => {
        let chat = msgData.chat;
        if (!chat.users) return console.log("chat users not defined");

        chat.users.forEach((user) => {
          if (user._id === msgData.sender._id) return;
          socket.in(user._id).emit("message_received", msgData);
        });
      });

      socket.off("setup", (userData) => {
        socket.leave(userData._id); // This will create a new room for particular user
      });
    });
  })
  .catch((err) => console.log("app.js connection error=", err));
