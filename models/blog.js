const mongoose = require("mongoose");
const { Schema } = mongoose;

const userSchema = new Schema({
  id: String,
});

var postSchema = new Schema({
  title: String,
  content: String,
  images: { url: String },
  createdAt: {
    type: Date,
    default: Date.now(),
  },
  hashtags: [{ hashTag: "String", id: Number }],
  status: String,
  feed: { type: Boolean, default: false },
  publish: { type: Boolean, default: false },
  neverShow: { type: Boolean, default: false },
  user: { userId: String, username: String },
  likes: [{ userId: String, username: String }],
  comments: [
    {
      userId: String,
      username: String,
      comment: String,
      createdAt: {
        type: Date,
        default: new Date(),
      },
    },
  ],
  save: [{ userId: String, username: String }],
});
postSchema.index({
  title: "text",
  "user.username": "text",
  "hashtags.hashTag": "text",
});

var User = mongoose.model("User", userSchema);
var Post = mongoose.model("Post", postSchema);
module.exports = { Post, User };
