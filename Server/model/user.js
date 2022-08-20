const mongoose = require("mongoose");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");

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
    notification: [
      {
        id: {
          type: mongoose.Schema.Types.ObjectId,
        },
        image: {
          type: String,
        },
        username: {
          type: String,
        },
        name: {
          type: String,
        },
        type: {
          type: String,
        },
      },
    ],
    hiddenPosts: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "posts",
      },
    ],
    resetPasswordToken: String,
    resetPasswordExpire: Date,
  },
  { timestamps: true }
);

userSchema.methods.getResetPasswordToken = function () {
  const resetToken = crypto.randomBytes(20).toString("hex");

  this.resetPasswordToken = crypto
    .createHash("sha256")
    .update(resetToken)
    .digest("hex");

  this.resetPasswordExpire = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

userSchema.methods.generateAuthToken = async function () {
  const user = this;
  const token = jwt.sign({ _id: user._id.toString() }, "dontKnow");
  return token;
};

const user = mongoose.model("users", userSchema);

module.exports = user;
