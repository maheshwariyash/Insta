const mongoose = require("mongoose");

const postSchema = new mongoose.Schema(
  {
    caption: {
      type: String,
      default: null,
    },
    location: {
      type: String,
      default: null,
    },
    image: {
      type: String,
    },
    likedBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    hiddenBy: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    comments: [
      {
        content: {
          type: String,
        },
        uid: {
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

const post = mongoose.model("posts", postSchema);

module.exports = post;
