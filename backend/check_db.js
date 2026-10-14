require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./src/config/db");
const Post = require("./src/models/post");

async function check() {
  await connectDB();
  const posts = await Post.find().sort({ createdAt: -1 }).limit(10).lean();
  for (const p of posts) {
    console.log(JSON.stringify({
      id: p._id,
      content: p.content ? p.content.slice(0, 35) : "",
      media: p.media,
      mediaUrl: p.mediaUrl,
      originalPostMedia: p.originalPost?.media,
      originalPostMediaUrl: p.originalPost?.mediaUrl
    }, null, 2));
  }
  await mongoose.disconnect();
}
check();
