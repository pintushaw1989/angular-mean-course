const express = require("express");
const multer = require("multer");

const Post = require("../models/post");

const router = express.Router();

const MIME_TYPE = {
  "image/png": "png",
  "image/jpeg": "jpg",
  "image/jpg": "jpg",
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE[file.mimetype];
    let error = new Error("Invalid mime type");
    if (isValid) {
      error = null;
    }
    cb(error, "backend/images");
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(" ").join("-");
    const ext = MIME_TYPE[file.mimetype];

    cb(null, name + "-" + Date.now() + "." + ext);
  },
});

router.post(
  "",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    const url = req.protocol + "://" + req.get("host");
    const post = new Post({
      title: req.body.title,
      content: req.body.content,
      imagePath: url + "/images/" + req.file.filename,
    });

    post.save().then((createdPost) => {
      res.status(201).json({
        message: "Post added successfully",
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    });
  }
);

router.put(
  "/:id",
  multer({ storage: storage }).single("image"),
  (req, res, next) => {
    let imagePath = req.body.imagePath;
    if (req.file) {
      const url = req.protocol + "://" + req.get("host");
      imagePath = url + "/images/" + req.file.filename;
    }
    const post = new Post({
      _id: req.body.id,
      title: req.body.title,
      content: req.body.content,
      imagePath: imagePath,
    });
    console.log(post);
    Post.updateOne({ _id: req.params.id }, post).then((updatedPost) => {
      console.log(updatedPost);
      res.status(200).json({
        message: "Post updated successfully",
      });
    });
  }
);

router.get("", (req, res, next) => {
  // const posts = [
  //   {
  //     id: "fjlkdsjfjds",
  //     title: "First Post server",
  //     content: "This is first post content",
  //   },
  //   {
  //     id: "fjlkdsjjds",
  //     title: "Second Post",
  //     content: "This is secont post content",
  //   },
  //   {
  //     id: "fjlkdsjfjd",
  //     title: "Third Post",
  //     content: "This is third post content",
  //   },
  // ];

  Post.find().then((documents) => {
    console.log(documents);
    res.status(200).json({
      message: "Posts fetched success",
      posts: documents,
    });
  });
});

router.get("/:id", (req, res, next) => {
  Post.findById(req.params.id).then((post) => {
    if (post) {
      res.status(200).json(post);
    } else {
      req.status(400).json({ message: "Post not found!" });
    }
  });
});

router.delete("/:id", (req, res, next) => {
  Post.deleteOne({
    _id: req.params.id,
  }).then((result) => {
    console.log(result);
    res.status(200).json({
      message: "Posts deleted",
    });
  });
});

module.exports = router;
