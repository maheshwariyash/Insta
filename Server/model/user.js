const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    username: {
      type: String,
    },
    phoneNo: {
      type: Number,
      default: null,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      default: null,
    },
    profilePic: {
      type: String,
    },
    accountType: {
      type: String,
      default: "public",
    },
    loginType: {
      type: String,
      default: "local",
    },
    posts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    chats: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "chats",
      },
    ],
    friends: [
      {
        fid: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "users",
        },
        isfriend: {
          type: Boolean,
          default: false,
        },
      },
    ],
    likedPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    hiddenPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
  },
  { timestamps: true }
);

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "dontKnow");
  return token;
};

const user = mongoose.model("users", userSchema);

module.exports = user;
