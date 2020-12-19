const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');

const Post = require('../models/Post');
const User = require('../models/User');

router.get('/user/:id', requireLogin, (req, res) => {
  User.findOne({ _id: req.params.id })
    .select('-password')
    .then((user) => {
      Post.find({ postedBy: req.params.id })
        .populate('postedBy', '_id name profilePicture')
        .exec((error, posts) => {
          if (error) {
            return res.status(400).send(error);
          } else {
            res.json({ user, posts });
          }
        });
    })
    .catch((error) => res.status(400).json({ error: 'User not found!' }));
});

router.put('/follow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.followId,
    {
      $push: { followers: req.user._id },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(400).send(error);
      }
      User.findByIdAndUpdate(
        req.user._id,
        { $push: { following: req.body.followId } },
        { new: true }
      )
        .select('-password')
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((error) => res.status(400).send(error));
    }
  );
});

router.put('/unfollow', requireLogin, (req, res) => {
  User.findByIdAndUpdate(
    req.body.unfollowId,
    {
      $pull: { followers: req.user._id },
    },
    { new: true },
    (error, result) => {
      if (error) {
        return res.status(400).send(error);
      }
      User.findByIdAndUpdate(
        req.user._id,
        { $pull: { following: req.body.unfollowId } },
        { new: true }
      )
        .select('-password')
        .then((result) => {
          res.status(200).json(result);
        })
        .catch((error) => res.status(400).send(error));
    }
  );
});

module.exports = router;
