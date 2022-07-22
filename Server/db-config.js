const mongoose = require("mongoose");
require("dotenv").config();

const MONGO_URI = process.env.MONGO_URI;

mongoose
  .connect(MONGO_URI)
  .then((x) => {
    console.log("connected to MongoDb Success....");
  })
  .catch((err) => {
    console.log("error in connecting to MongoDb");
  });
