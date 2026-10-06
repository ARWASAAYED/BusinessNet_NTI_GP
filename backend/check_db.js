require("dotenv").config();
const mongoose = require("mongoose");
const User = require("./src/models/user");
const Post = require("./src/models/post");

async function check() {
  await mongoose.connect(process.env.MONGODB_URI);
  const userCount = await User.countDocuments();
  const postCount = await Post.countDocuments();
  console.log(`Users: ${userCount}, Posts: ${postCount}`);
  await mongoose.disconnect();
}
check();
