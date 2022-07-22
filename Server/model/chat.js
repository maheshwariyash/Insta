const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema(
  {
    users: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    message: [
      {
        content: {
          type: String,
        },
        sender: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        timestamp: {
          type: Date,
          default: Date.now,
        },
      },
    ],
  },
  { timestamps: true }
);

const chat = mongoose.model("chats", chatSchema);

module.exports = chat;
