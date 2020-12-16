const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const requireLogin = require('../middleware/requireLogin');

const Post = require('../models/Post');

router.get('/allposts', (req, res) => {
  Post.find()
    .populate('postedBy', '_id name')
    .then((posts) => {
      res.status(200).json({ posts: posts });
    })
    .catch((error) => res.status(400).send(error));
});

router.post(
  '/createpost',
  requireLogin,
  [
    check('title', 'Title is required...').not().isEmpty(),
    check('body', 'Body is required...').not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { title, body } = req.body;

    req.user.password = undefined;

    const post = new Post({
      title,
      body,
      postedBy: req.user,
    });
    post
      .save()
      .then((result) => {
        res.status(200).json({ post: result });
      })
      .catch((error) => res.status(400).send(error));
  }
);

router.get('/myposts', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', '_id name')
    .then((myPosts) => {
      res.status(200).json({ myPosts });
    })
    .catch((error) => res.status(400).send(error));
});

module.exports = router;
