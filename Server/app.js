var express = require("express");
var app = express();
var path = require("path");
const http = require("http");
const server = http.createServer(app);
var cookieParser = require("cookie-parser");
var cors = require("cors");
require("dotenv").config();
require("./db-config");
const io = require("socket.io")(server, { cors: { origin: "*" } });

var postsRouter = require("./routes/posts");
var usersRouter = require("./routes/users");
var chatsRouter = require("./routes/chats");

// view engine setup
app.set("views", path.join(__dirname, "views"));
app.set("view engine", "jade");

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));
app.use(express.static("/home/yash/Insta/Server/public/images/profilePic"));
app.use(express.static("/home/yash/Insta/Server/public/images/post"));

app.use(cors({ credentials: true, origin: true }));

app.use("/post", postsRouter);
app.use("/user", usersRouter);
app.use("/chat", chatsRouter);

const Post = require("./model/posts");
const User = require("./model/user");
const Chat = require("./model/chat");

// socket Implementation -----------------------

io.on("connection", (user) => {
  console.log("new user connected");

  // to join in its own userId room
  user.on("chatUserRoom", (data) => {
    user.userId = data.userId;
    user.join(user.userId);
  });

  // to join user in room in comment
  user.on("userdata", async (data) => {
    user.id = data.userId;
    user.postId = data.postId;
    user.join(user.postId);
  });

  // to join user in room in chat
  user.on("chatdata", async (data) => {
    user.user1 = data.user1;
    user.join(data.user1._id);
  });

  // to create a new chat
  user.on("createChat", async (data) => {
    console.log("cc");
    const obj = {
      users: [data.uid, data.sid],
      message: [{ content: data.content, sender: data.uid }],
    };
    const chatMessage = new Chat(obj);
    await chatMessage.save();
    const chatId = chatMessage._id;
    await User.findByIdAndUpdate(data.uid, { $push: { chats: chatId } });
    await User.findByIdAndUpdate(data.sid, { $push: { chats: chatId } });
    let updatedData = {
      message: chatMessage.message[0],
      _id: chatId,
      user1: user.user1,
    };
    io.to(data.sid).emit("receiveMessage", updatedData);
  });

  // to save a chat message in db
  user.on("sendMessage", async (data) => {
    const chatId = data.chatId;

    messageData = {
      content: data.content,
      sender: user.userId,
    };
    await Chat.findByIdAndUpdate(chatId, {
      $push: { message: messageData },
    }).catch((err) => {
      console.log("error in uploading message");
    });
    let updatedData = {
      message: {
        content: data.content,
        timestamp: new Date(),
        sender: user.userId,
      },
      _id: chatId,
      user1: user.user1,
    };
    io.to(data.sid).emit("receiveMessage", updatedData);
  });

  // to save a comment message on post in db
  user.on("sendComment", async (data) => {
    const postId = data.pid;

    commentData = {
      content: data.content,
      uid: data.uid,
    };

    await Post.findByIdAndUpdate(postId, {
      $push: { comments: commentData },
    }).catch((err) => {
      console.log("error in uploading comment");
    });

    let user1 = await User.findById(commentData.uid).catch((err) => {
      console.log("error in findind data");
    });

    const user2 = [
      {
        _id: data.uid,
        name: user1.name,
        username: user1.username,
        profilePic: user1.profilePic,
      },
    ];
    const comments = {
      content: data.content,
      uid: data.uid,
      timestamp: new Date(),
    };

    const updatedData = { comments, user: user2, _id: postId };
    io.emit("receiveComment", updatedData);
  });

  // to remove user from room in comment
  user.on("userleave", async (data) => {
    user.leave(data.postId);
  });

  // to remove user from room in chat
  user.on("chatleave", async (data) => {
    user.leave(data.roomId);
  });
});

server.listen(process.env.PORT | 8000, () => {
  console.log("Server is running on Port : ", process.env.PORT);
});

module.exports = app;
