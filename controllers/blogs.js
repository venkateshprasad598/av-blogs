// const Blog = require("../models/blog");
const { User, Post } = require("../models/blog");

// Post.createIndex({ title: "text", "user.username": "text" });

const getAllBlogs = async (req, res) => {
  console.log(req.query);
  let pageNo = parseInt(req.query.page);
  let searchQuery = req.query.q?.toLowerCase();
  console.log(searchQuery);
  let size = 5;
  if (pageNo < 0 || pageNo === 0) {
    response = {
      error: true,
      message: "invalid page number, should start with 1",
    };
    return res.json(response);
  }
  let skip = size * (pageNo - 1);
  let limit = size;

  if (searchQuery?.length > 0) {
    try {
      const blog = await Post.find({ $text: { $search: searchQuery } })
        .skip(skip)
        .limit(limit);

      if (!blog) {
        return res.status(404).json("No Blogs Found");
      }

      return res.status(201).json({ blog });
    } catch (err) {
      res.status(500).json({ message: err });
    }
  }

  try {
    const blog = await Post.find({ status: "posted", feed: true })
      .sort({
        createdAt: -1,
      })
      .skip(skip)
      .limit(limit);

    if (!blog) {
      return res.status(404).json("No Blogs Found");
    }
    
    res.status(201).json({ blog });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const postBlog = async (req, res) => {
  try {
    const { title, content, user, status } = req.body;
    console.log({ req: req.body });
    const body = { ...req.body, createdAt: Date.now() };

    // if (!title || !content || !user.userId || !status) {
    //   return res.status(404).json({ msg: "Proper Data is not Provided" });
    // }
    // const createUser = await User.create({ id: req.body.user.userId });
    const blog = await Post.create(body);
    res.status(201).json({ blog });
  } catch (err) {
    res.status(500).json({ message: err });
  }
};

const getAllDrafts = async (req, res) => {
  const { id } = req.params;

  try {
    const blog = await Post.find({
      "user.userId": id,
      status: "draft",
    }).sort({ createdAt: -1 });
    console.log(blog);

    if (!blog) {
      return res.status(404).json("No Blog Found");
    }

    res.status(201).json({ blog });
  } catch (error) {
    console.log(error);
  }
};

const deleteMany = async (req, res) => {
  try {
    const blog = await Post.deleteMany();
    res.status(201).json("SUUCESSFULLY DELETED ALL DATA");
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const getSingleBlog = async (req, res) => {
  try {
    console.log("No Redis Running");

    const { id } = req.params;
    const blog = await Post.findOne({ _id: id });
    if (!blog) {
      return res.status(404).json("No Task Found");
    }
    res.status(200).json({ blog });
  } catch (err) {
    res.status(404).json({ message: err });
  }
};

const saveBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json("No ID Found");
    }
    const message = await Post.updateOne(
      { _id: id },
      { $push: { save: req.body } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!message) {
      return res.status(404).json("No Message Found");
    }
    res.status(200).json(message);
  } catch (err) {
    res.status(501).json("Error");
  }
};

const unsaveBLog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json("No ID Found");
    }
    const message = await Post.updateOne(
      { _id: id },
      {
        $pull: { save: req.body },
      }
    );
    if (!message) {
      return res.status(404).json("No Message Found");
    }
    res.status(200).json(message);
  } catch (err) {
    res.status(501).json("Error");
  }
};

const likeOnBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json("No ID Found");
    }
    const message = await Post.updateOne(
      { _id: id },
      { $push: { likes: req.body } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!message) {
      return res.status(404).json("No Message Found");
    }
    res.status(200).json(message);
  } catch (err) {
    res.status(501).json("Error");
  }
};

const unlikeOnBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json("No ID Found");
    }
    const message = await Post.updateOne(
      { _id: id },
      {
        $pull: { likes: req.body },
      }
    );
    if (!message) {
      return res.status(404).json("No Message Found");
    }
    res.status(200).json(message);
  } catch (err) {
    res.status(501).json("Error");
  }
};

const commentOnBlog = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json("No ID Found");
    }

    const message = await Post.updateOne(
      { _id: id },
      { $push: { comments: { ...req.body, createdAt: Date.now() } } },
      {
        new: true,
        runValidators: true,
      }
    );
    if (!message) {
      return res.status(404).json("No Message Found");
    }

    res.status(200).json(message);
  } catch (err) {
    res.status(501).json("Error");
  }
};

const allSavedBlogs = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json("No ID Found");
    }

    const savedByUser = await Post.find({
      save: { $elemMatch: { userId: id } },
      feed: true,
    }).sort({
      createdAt: -1,
    });

    if (!savedByUser) {
      L;
      return res.status(404).json("No Saved By User Found");
    }
    res.status(200).json({ savedByUser });
  } catch (err) {
    res.status(501).json("Error");
  }
};

const removeDraft = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json("No ID Found");
    }

    const removeDraft = await Post.updateOne(
      { _id: id },
      { $set: { status: "draft deleted" } }
    );

    res.status(200).json({ removeDraft });
  } catch (error) {
    res.status(501).json("Error");
  }
};

const resumeDraft = async (req, res) => {
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(404).json("No ID Found");
    }

    const resumeDraft = await Post.findOneAndUpdate(
      { _id: id },
      { ...req.body, createdAt: Date.now() }
    );
    if (!resumeDraft) {
      return res.status(500).json("Enter Correct Data");
    }
    console.log("Hello");
    res.status(200).json({ resumeDraft });
  } catch (error) {
    res.status(501).json("Error");
  }
};

const getAllTags = async (req, res) => {
  console.log("Hello");
  try {
    const blog = await Post.find({})
      .sort({
        createdAt: -1,
      })
      .limit(10);

    if (!blog) {
      return res.status(404).json("Enter Correct Data");
    }
    let tags = {};
    blog.map((data) => {
      data.hashtags.map((metadata) => {
        let key = metadata.hashTag;
        if (tags[key]) {
          tags[key] = tags[key] + 1;
        } else {
          tags[key] = 1;
        }
      });
    });
    console.log("Tags");
    console.log(tags);
    let newObj = { ...tags };
    let keys = Object.keys(newObj);
    let sortedTags = keys.sort((a, b) => newObj[b] - newObj[a]);
    res.status(200).json({ tags: sortedTags });
  } catch (error) {
    res.status(500).json("Error");
  }
};

const getSingleTag = async (req, res) => {
  try {
    const { name } = req.params;
    console.log(name);
    const blog = await Post.find({
      hashtags: {
        $elemMatch: {
          hashTag: name,
        },
      },
    });

    if (!blog) {
      return res.status(404).json("No Saved By User Found");
    }
    res.status(200).json({ blog });
  } catch (err) {
    res.status(501).json("Error");
  }
};

const getTrendingBlogs = async (req, res) => {
  try {
    // const blog = await Post.aggregate([
    //   { $unwind: "$likes" },
    //   {
    //     $group: {
    //       _id: "$_id",
    //       blogs: {
    //         $push: {
    //           title: "$title",
    //           user: "$user",
    //           content: "$content",
    //           images: "$images",
    //           likes: "$likes",
    //           comments: "$comments",
    //         },
    //       },
    //       likes: { $push: "$likes" },
    //       size: { $sum: 1 },
    //     },
    //   },
    //   { $sort: { size: -1 } },
    // ]).limit(5);
    const blog = await Post.find({ "images.url": { $gt: 1 }, feed: true })
      .select("title user content images likes comments")
      .sort({ "likes.length": -1 })
      .limit(10);

    res.status(200).send({ blog });
  } catch (error) {
    console.log(error);
  }
};

const searchBlogs = async (req, res) => {
  console.log(req.query);
  try {
    console.log(Post);
    const blog = await Post.find();
    const vblog = blog.filter((b) =>
      b.title.toLowerCase().includes(req.query.name)
    );
    console.log({ vblog });
    res.status(200).send({ vblog });
  } catch (error) {
    console.log(error);
  }
};

const getPublishBlogs = async (req, res) => {
  console.log(req.query);
  const { status, id, userSide } = req.query;

  console.log("hello Parasm");
  try {
    let blog;
    if (status === "pending") {
      if (userSide === "CLIENT") {
        console.log("CLIENT");
        blog = await Post.find({
          "user.userId": id,
          status: "posted",
          feed: false,
          publish: false,
        }).sort({
          createdAt: -1,
        });
      } else {
        console.log("ADMIN");
        blog = await Post.find({
          status: "posted",
          feed: false,
          publish: false,
        }).sort({
          createdAt: -1,
        });
      }
    } else if (status == "approved") {
      blog = await Post.find({
        $or: [
          {
            status: "posted",
            feed: true,
            publish: false,
          },
          {
            status: "posted",
            feed: false,
            publish: true,
          },
          {
            status: "posted",
            feed: true,
            publish: true,
          },
        ],
      }).sort({
        createdAt: -1,
      });
    } else if (status == "archived") {
      blog = await Post.find({
        status: "archived",
      }).sort({
        createdAt: -1,
      });
    }
    // } else if (status == "feeds") {
    //   blog = await Post.find({
    //     status: "posted",
    //     feed: true,
    //     publish: false,
    //   });
    // } else if (status == "public") {
    //   blog = await Post.find({
    //     status: "posted",
    //     feed: false,
    //     publish: true,
    //   });
    // } else if (status == "both") {
    //   blog = await Post.find({
    //     status: "posted",
    //     feed: true,
    //     publish: true,
    //   });
    // }
    console.log(blog);
    if (!blog) {
      res.status(404).json({ status: "Not Found" });
    }
    res.status(200).send({ blog });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error });
  }
};

const updateFeed = async (req, res) => {
  const { approve, id } = req.query;
  console.log(approve);
  try {
    let blog;
    if (approve == "feed") {
      blog = await Post.updateOne({ _id: id }, { feed: true }, { new: true });
    } else if (approve == "public") {
      blog = await Post.updateOne(
        { _id: id },
        { publish: true },
        { new: true }
      );
    } else if (approve == "archive") {
      blog = await Post.updateOne(
        { _id: id },
        { status: "archived" },
        { new: true }
      );
    } else if (approve == "removeArchived") {
      blog = await Post.updateOne(
        { _id: id },
        { status: "posted", feed: false, publish: false },
        { new: true }
      );
    }
    if (!blog) {
      res.status(404).json({ status: "Not Found" });
    }
    res.status(200).send({ blog });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error });
  }
};

const updatePublish = async (req, res) => {
  try {
    console.log(req.params.id);
    const blog = await Post.updateOne(
      { _id: req.params.id },
      { publish: true },
      { new: true }
    );
    if (!blog) {
      res.status(404).json({ status: "Not Found" });
    }
    res.status(200).send({ blog });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error });
  }
};

const archive = async (req, res) => {
  try {
    console.log(req.params.id);
    const blog = await Post.updateOne(
      { _id: req.params.id },
      { publish: true },
      { new: true }
    );
    if (!blog) {
      res.status(404).json({ status: "Not Found" });
    }
    res.status(200).send({ blog });
  } catch (error) {
    res.status(501).json({ status: "fail", message: error });
  }
};

module.exports = {
  getAllBlogs,
  postBlog,
  deleteMany,
  getSingleBlog,
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
};
