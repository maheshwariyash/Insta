const jwt = require("jsonwebtoken");
const User = require("../../model/user");

const auth = async (req, res, next) => {
  try {
    const token = req.cookies.token;
    const decoded = jwt.verify(token, "dontKnow");
    const user = await User.findOne({
      _id: decoded._id,
    });
    if (!user) {
      throw new Error();
    }
    req.token = token;
    req.user = user;
    next();
  } catch (error) {
    res.send({ message: "Please authenticate" });
  }
};

module.exports = auth;
