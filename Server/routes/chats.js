var express = require("express");
var router = express.Router();
var auth = require("../modules/middleware/auth");
var User = require("../model/user");
var Chat = require("../model/chat");
const mongoose = require("mongoose");

router.get("/recentchats", auth, async (req, res) => {
  // const id = mongoose.Types.ObjectId("62bc5690d329af1a68161653");
  try {
    User.aggregate([
      {
        $match: { _id: req.user._id },
      },
      {
        $unwind: "$chats",
      },
      {
        $lookup: {
          from: "chats",
          localField: "chats",
          foreignField: "_id",
          as: "chat",
        },
      },
      {
        $project: {
          chat: 1,
        },
      },
      {
        $unwind: "$chat",
      },
      {
        $unwind: "$chat.users",
      },
      {
        $match: { "chat.users": { $ne: req.user._id } },
      },
      {
        $addFields: {
          lastmsg: { $arrayElemAt: ["$chat.message", -1] },
        },
      },
      {
        $project: {
          _id: 0,
          "chat._id": 1,
          "chat.users": 1,
          lastmsg: 1,
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "chat.users",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $addFields: { chatId: "$chat._id" },
      },
      {
        $addFields: {
          user: { $arrayElemAt: ["$user", -1] },
        },
      },
      {
        $project: {
          "user._id": 1,
          "user.name": 1,
          "user.username": 1,
          "user.profilePic": 1,
          lastmsg: 1,
          chatId: 1,
        },
      },
    ]).exec((error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    });
  } catch (error) {}
});

router.get("/getmessages/:id", auth, async (req, res) => {
  const id1 = mongoose.Types.ObjectId(req.params.id);
  let currentPage = req.query.currentPage;

  let users = [];
  users.push(req.user._id);
  users.push(id1);
  // console.log(users);

  try {
    Chat.aggregate([
      {
        $match: { users: { $all: users } },
      },
      {
        $unwind: "$message",
      },
      {
        $addFields: {
          "message.isMine": {
            $eq: ["$message.sender", req.user._id],
          },
        },
      },
      {
        $project: {
          message: 1,
        },
      },
      {
        $sort: { "message.timestamp": -1 },
      },
      {
        $skip: currentPage * 20,
      },
      {
        $limit: 20,
      },
    ]).exec((error, result) => {
      if (error) console.log(error);
      res.send(result);
    });
  } catch (error) {
    res.send(error);
  }
});

module.exports = router;
