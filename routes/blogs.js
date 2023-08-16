const express = require("express");
const router = express.Router();

const {
  getAllBlogs,
  postBlog,
  getSingleBlog,
  deleteMany,
  saveBlog,
  allSavedBlogs,
  likeOnBlog,
  commentOnBlog,
  unlikeOnBlog,
  unsaveBLog,
  removeDraft,
  resumeDraft,
  getAllDrafts,
  getAllTags,
  getSingleTag,
  getTrendingBlogs,
  searchBlogs,
  getPublishBlogs,
  updateFeed,
  updatePublish,
  //   login,
} = require("../controllers/blogs");

// router.route("/").get(getAllBlogs).post(postBlog);
router.get("/", getAllBlogs);
router.post("/", postBlog);

//getPublishBlogs
// router.route("/publish").get(getPublishBlogs).patch(updateFeed);
router.get("/publish", getPublishBlogs);
router.patch("/publish", updateFeed);
router.patch("/updatePublish/:id", updatePublish);

//getUserDrafts
router.get("/drafts/:id", getAllDrafts);
//Remove Draft
router.patch("/removeDraft/:id", removeDraft);
//resume Draft
router.put("/resume/:id", resumeDraft);
//ID OF A BLOG
router.get("/:id", getSingleBlog);
// *****SAVE*****
//ID OF A BLOG
router.post("/save/:id", saveBlog);
router.put("/unSave/:id", unsaveBLog);
//ID OF A USER WHO HAVE SAVED ALL BLOGS
router.get("/save/:id", allSavedBlogs);

// *****LIKE*****
// ID OF A BLOG
router.post("/likes/:id", likeOnBlog);
router.put("/unlike/:id", unlikeOnBlog);

// *****COMMENT*****
//ID OF A BLOG
router.post("/comments/:id", commentOnBlog);

// *****DELETE ALL DATA*****
router.delete("/", deleteMany);

//TRENDING BLOGS
router.get("/trendingBlogs/blogs", getTrendingBlogs);
//TAGS
router.get("/hashtags/tags", getAllTags);
router.get("/hashtags/singleTag/:name", getSingleTag);
//Search Functionality
router.get("/search/blogs", searchBlogs);

module.exports = router;
