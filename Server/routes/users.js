var express = require("express");
var router = express.Router();
const bcrypt = require("bcryptjs");
const User = require("../model/user");
const auth = require("../modules/middleware/auth");
const multer = require("multer");
const path = require("path");
const { default: mongoose } = require("mongoose");
const fs = require("fs");

// multer initialization
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("desti", __dirname);
    cb(null, path.join(__dirname, "../public/images/profilePic/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

// User Registration
router.post("/register", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (user) {
      res.send({ message: "Already Registered. Login Please", isValid: false });
    } else if (!req.body.password) {
      const user = new User(req.body);
      await user.save();
      const token = await user.generateAuthToken();
      res.cookie("token", token, {
        httpOnly: true,
        secure: true,
      });
      res.status(200).send({
        message: "Registered Successfully",
        user,
        isRegistered: true,
      });
    } else {
      if (req.body.password == req.body.confirmPassword) {
        const hashedpassword = req.body.password;
        req.body.password = await bcrypt.hash(hashedpassword, 8);
        const user = new User(req.body);
        await user.save();
        const token = await user.generateAuthToken();
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
        });
        res.status(200).send({
          message: "Registered Successfully",
          user,
          isRegistered: true,
        });
      } else {
        throw { message: "password didn't match", isRegistered: false };
      }
    }
  } catch (error) {
    console.log(error);
    res.send({ message: "Error while registering", isRegistered: false });
  }
});

//User Login
router.post("/login", async (req, res) => {
  try {
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      res.send({
        message: "First Register Please",
        isValid: false,
        isregis: true,
      });
    } else {
      if (!req.body.password) {
        const token = await user.generateAuthToken();
        res.cookie("token", token, {
          httpOnly: true,
          secure: true,
        });
        res
          .status(200)
          .send({ message: "LogIn Successfully", user, isValid: true });
      } else {
        const isValidPass = await bcrypt.compare(
          req.body.password,
          user.password
        );
        if (!isValidPass) {
          res.send({
            message: "Invalid Password or Email",
            isValid: false,
            isregis: false,
          });
        } else {
          const token = await user.generateAuthToken();
          res.cookie("token", token, {
            httpOnly: true,
            secure: true,
          });
          res
            .status(200)
            .send({ message: "LogIn Successfully", user, isValid: true });
        }
      }
    }
  } catch (error) {
    res.send({ message: "Error while login", isValid: false });
  }
});

//  User auto login
router.get("/login", auth, (req, res) => {
  res.send({ user: req.user });
});

// User Logout
router.get("/logout", (req, res) => {
  res.clearCookie("token");
  res.send({
    message: "Loggedout Successfully",
  });
});

//  User Profile Updation
router.post(
  "/update-profile",
  auth,
  upload.single("profilePic"),
  async (req, res) => {
    try {
      console.log("123");
      let obj = req.body;
      const user1 = await User.findById(req.user._id);
      if (req.file) {
        console.log("hii");
        obj.profilePic = req.file.filename;
      } else if (!user1.profilePic || obj.checked) {
        if (obj.checked && user1.profilePic != "userimage.png") {
          const profilepicpath =
            path.join(__dirname, "../public/images/profilePic/") +
            user1.profilePic;
          fs.unlink(profilepicpath, (err) => {
            if (err) {
              console.log(err);
            } else {
              console.log("file deleted!!");
            }
          });
        }
        obj.profilePic = "userimage.png";
      } else {
        obj.profilePic = user1.profilePic;
      }
      const user = await User.findByIdAndUpdate({ _id: req.user._id }, obj, {
        new: true,
      });
      await user.save();
      res.send({
        message: " Profile Updated Successfully",
        isValid: true,
        user,
      });
    } catch (error) {
      console.log(error);
      res.send({ message: "Error while Profile Updation", isValid: false });
    }
  }
);

// get list of friend req list
router.get("/friendreq", auth, async (req, res) => {
  // const id = mongoose.Types.ObjectId("62a1cc1cbf24f1fa858d69a6");
  const user = User.aggregate([
    {
      $match: { _id: req.user._id },
    },
    {
      $project: {
        _id: 0,
        ids: {
          $filter: {
            input: "$friends",
            as: "id",
            cond: { $eq: ["$$id.isfriend", false] },
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ids.fid",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        "user._id": 1,
        "user.name": 1,
        "user.username": 1,
        "user.profilePic": 1,
      },
    },
  ]).exec((error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

// get list of friends list
router.get("/friendlist/:id", auth, async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);
  const user = User.aggregate([
    {
      $match: { _id: id },
    },
    {
      $project: {
        _id: 0,
        ids: {
          $filter: {
            input: "$friends",
            as: "id",
            cond: { $eq: ["$$id.isfriend", true] },
          },
        },
      },
    },
    {
      $lookup: {
        from: "users",
        localField: "ids.fid",
        foreignField: "_id",
        as: "user",
      },
    },
    {
      $project: {
        "user._id": 1,
        "user.name": 1,
        "user.username": 1,
        "user.profilePic": 1,
      },
    },
  ]).exec((error, result) => {
    if (error) {
      console.log(error);
    }
    res.send(result);
  });
});

// On friend request confirm
router.post("/confirm", auth, async (req, res) => {
  try {
    const id = req.user._id;
    const uid = mongoose.Types.ObjectId(req.body.id);

    await User.updateOne(
      { _id: id, "friends.fid": uid },
      { $set: { "friends.$.isfriend": true } },
      { new: true }
    );
    await User.updateOne(
      { _id: uid },
      { $push: { friends: { fid: id, isfriend: true } } },
      { new: true }
    );

    const user = await User.findById({ _id: id });
    console.log(user);
    res.send(user);
  } catch (error) {
    console.log(error);
  }
});

// On Friend Request Delete
router.post("/delete", auth, async (req, res) => {
  try {
    const id = req.user._id;
    const uid = mongoose.Types.ObjectId(req.body.id);
    await User.updateOne({ _id: id }, { $pull: { friends: { fid: uid } } });

    const user = await User.findById({ _id: id });
    console.log(user);
    res.send(user);
  } catch (error) {
    console.log(error);
    // res.send(error);
  }
});

// On Unfriend
router.get("/unfriend/:id", auth, async (req, res) => {
  try {
    const id = req.user._id;
    const uid = mongoose.Types.ObjectId(req.params.id);

    await User.updateOne({ _id: id }, { $pull: { friends: { fid: uid } } });
    await User.updateOne({ _id: uid }, { $pull: { friends: { fid: id } } });

    const user = await User.findById({ _id: id });
    const user1 = await User.findById({ _id: uid });

    res.send({ user, user1 });
  } catch (error) {
    console.log(error);
    // res.send(error);
  }
});

// User Add Friend
router.get("/addfriend/:id", auth, async (req, res) => {
  try {
    const fid = mongoose.Types.ObjectId(req.params.id);
    let user1 = await User.findById({ _id: fid });
    user1.friends.push({ fid: req.user._id });
    await user1.save();

    res.send({ user1 });
  } catch (error) {
    console.log(error);
    // res.send(error);
  }
});

// to find users in search Bar
router.post("/search", auth, async (req, res) => {
  // User.collection.createIndex({ name: 1, username: 1 });
  try {
    const search = req.body.query;
    const str = "^" + search;
    const str1 = "^" + search + "| " + search;
    console.log(str1);
    const users = User.aggregate([
      {
        $match: {
          $or: [
            { name: new RegExp(str1, "i") },
            { username: new RegExp(str, "i") },
          ],
        },
      },
      {
        $limit: 10,
      },
    ]).exec((error, result) => {
      if (error) {
        console.log(error);
      }
      res.send(result);
    });
  } catch (error) {
    console.log(error);
    // res.send(error);
  }
});

// get User by Id
router.get("/:id", auth, async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    res.send(user);
  } catch (error) {
    console.log(error);
    // res.send(error);
  }
});

module.exports = router;
