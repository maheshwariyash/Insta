var express = require("express");
var router = express.Router();
var Post = require("../model/posts");
var auth = require("../modules/middleware/auth");
var User = require("../model/user");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const fs = require("fs");

/* GET home page. */

const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    // console.log("desti", __dirname);
    cb(null, path.join(__dirname, "../public/images/post/"));
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

const upload = multer({ storage: fileStorageEngine });

// AddPost by a user
router.post("/addpost", auth, upload.single("image"), async (req, res) => {
  try {
    req.body.image = req.file.filename;
    const post = new Post(req.body);
    await post.save();
    const user = await User.findById(req.user._id);
    user.posts.push(post._id);
    await user.save();

    res.send({ message: "Post Added Successfully", user, isValid: true });
  } catch (error) {
    res.send({ message: "Post Not Added", isValid: false });
  }
});

// to get all posts in feed section
router.get("/feed", auth, async (req, res) => {
  // const id = mongoose.Types.ObjectId("62bc5690d329af1a68161653");
  let currentPage = req.query.currentPage;

  const post = User.aggregate([
    {
      $addFields: { iscreated: { $eq: ["$_id", req.user._id] } },
    },
    {
      $match: {
        $and: [{ accountType: "public" }, { iscreated: false }],
      },
    },
    { $unwind: "$posts" },
    { $project: { posts: 1, _id: 0 } },
    {
      $lookup: {
        from: "posts",
        localField: "posts",
        foreignField: "_id",
        as: "post",
      },
    },
    {
      $match: { "post.hiddenBy": { $nin: [req.user._id] } },
    },
    {
      $project: { "post.image": 1, "post._id": 1 },
    },
    {
      $skip: currentPage * 15,
    },
    {
      $limit: 15,
    },
  ]).exec((error, result) => {
    if (error) console.log(error);
    res.send(result);
  });
});

// to get all posts in home page
router.get("/home", auth, async (req, res) => {
  // const id = mongoose.Types.ObjectId("62bc5690d329af1a68161653");
  let currentPage = req.query.currentPage;

  const post = User.aggregate([
    {
      $match: { _id: req.user._id },
    },
    {
      $project: {
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
    { $unwind: "$user" },
    { $unwind: "$user.posts" },
    {
      $lookup: {
        from: "posts",
        localField: "user.posts",
        foreignField: "_id",
        as: "post",
      },
    },
    {
      $project: {
        user: 1,
        post: 1,
        test: {
          $arrayElemAt: ["$post", 0],
        },
      },
    },
    {
      $match: { "test.hiddenBy": { $nin: [req.user._id] } },
    },
    {
      $project: {
        _id: 0,
        "user._id": 1,
        "user.name": 1,
        "user.username": 1,
        "user.profilePic": 1,
        post: 1,
        isLiked: { $in: [req.user._id, "$test.likedBy"] },
      },
    },
    {
      $sort: { "post.createdAt": -1 },
    },
    {
      $skip: currentPage * 10,
    },
    {
      $limit: 10,
    },
  ]).exec((error, result) => {
    if (error) {
      console.log(error);
      res.send("error!!!");
    }
    res.send(result);
  });
});

// to get all Liked Posts
router.get("/likedpost", auth, async (req, res) => {
  // const id = mongoose.Types.ObjectId("62bc5690d329af1a68161653");
  try {
    User.aggregate([
      {
        $match: { _id: req.user._id },
      },
      {
        $unwind: "$likedPosts",
      },
      {
        $lookup: {
          from: "posts",
          localField: "likedPosts",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $project: {
          post: 1,
        },
      },
      {
        $sort: { "post.createdAt": -1 },
      },
    ]).exec((error, result) => {
      if (error) console.log(error);
      res.send(result);
    });
  } catch (error) {}
});

// to get all Hidden Posts
router.get("/hiddenpost", auth, async (req, res) => {
  // const id = mongoose.Types.ObjectId("62bc5690d329af1a68161653");
  try {
    User.aggregate([
      {
        $match: { _id: req.user._id },
      },
      {
        $unwind: "$hiddenPosts",
      },
      {
        $lookup: {
          from: "posts",
          localField: "hiddenPosts",
          foreignField: "_id",
          as: "post",
        },
      },
      {
        $project: {
          post: 1,
        },
      },
      {
        $sort: { "post.createdAt": -1 },
      },
    ]).exec((error, result) => {
      if (error) console.log(error);
      res.send(result);
    });
  } catch (error) {}
});

// to get all posts in user view profile
router.get("/userpost/:id", auth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const user = await User.findById(id);
    const data = await user.populate("posts");
    res.send(data);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// to find a post by id
router.get("/:id", auth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const post = await Post.findById(req.params.id);
    const user = await User.find({
      posts: { $in: [id] },
    });
    res.send({ post, user });
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// to Like a Post
router.get("/liked/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.likedBy.push(req.user._id);
    const user = await User.findById(req.user._id);
    user.likedPosts.push(post._id);
    await user.save();
    await post.save();
    res.send({ message: "liked Post" });
  } catch (error) {
    console.log(error);
  }
});

// to UnLike a Post
router.get("/unliked/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { likedBy: { $in: [req.user._id] } } },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { likedPosts: { $in: [req.params.id] } } },
      { new: true }
    );
    res.send({ message: "Unliked Post" });
  } catch (error) {
    console.log(error);
  }
});

// to Hide a Post
router.get("/hide/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.hiddenBy.push(req.user._id);
    const user = await User.findById(req.user._id);
    user.hiddenPosts.push(post._id);
    await user.save();
    await post.save();
    res.send({ message: "Post hide successfully" });
  } catch (error) {
    console.log(error);
  }
});

// to UnHide a Post
router.get("/unhide/:id", auth, async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { $pull: { hiddenBy: { $in: [req.user._id] } } },
      { new: true }
    );
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { hiddenPosts: { $in: [req.params.id] } } },
      { new: true }
    );
    res.send({ message: "Post Unhide Successfully" });
  } catch (error) {
    console.log(error);
  }
});

// User delete a post
router.patch("/delete/:id", auth, async (req, res) => {
  try {
    const id = mongoose.Types.ObjectId(req.params.id);
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { $pull: { posts: { $in: [id] } } },
      { new: true }
    );
    await user.save();
    const post = await Post.findById(id);
    const postpath =
      path.join(__dirname, "../public/images/post/") + post.image;
    fs.unlink(postpath, (err) => {
      if (err) {
        console.log(err);
      } else {
        console.log("file deleted!!");
      }
    });
    await Post.findByIdAndDelete(id);
    res.send({ message: "Post Deleted Successfully", user });
  } catch (error) {
    console.log(error);
    res.send({ message: "Post not Deleted", error });
  }
});

// to add comment by post id
router.post("/addcomment/:id", auth, async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    post.comments.push(req.body);
    await post.save();
    res.send(post);
  } catch (error) {
    console.log(error);
    res.send(error);
  }
});

// to get post comments by post id
router.get("/getcomments/:id", auth, async (req, res) => {
  const id = mongoose.Types.ObjectId(req.params.id);

  try {
    const post = Post.aggregate([
      {
        $match: { _id: id },
      },
      {
        $project: { comments: 1 },
      },
      {
        $unwind: "$comments",
      },
      {
        $lookup: {
          from: "users",
          localField: "comments.uid",
          foreignField: "_id",
          as: "user",
        },
      },
      {
        $project: {
          comments: 1,
          "user._id": 1,
          "user.name": 1,
          "user.username": 1,
          "user.profilePic": 1,
        },
      },
    ]).exec((error, result) => {
      if (error) {
        console.log(error);
        res.send(error);
      }
      res.send(result);
    });
  } catch (error) {
    res.send(error);
    console.log(error);
  }
});

module.exports = router;
