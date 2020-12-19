const express = require('express');
const router = express.Router();
const requireLogin = require('../middleware/requireLogin');

const Post = require('../models/Post');

router.get('/allposts', requireLogin, (req, res) => {
  Post.find()
    .populate('postedBy', '_id name profilePicture')
    .populate('comments.postedBy', '_id name profilePicture')
    .then((posts) => {
      res.status(200).json({ posts: posts });
    })
    .catch((error) => res.status(400).send(error));
});

router.get('/getsubscribedposts', requireLogin, (req, res) => {
  Post.find({ postedBy: { $in: req.user.following } })
    .populate('postedBy', '_id name profilePicture')
    .populate('comments.postedBy', '_id name profilePicture')
    .then((posts) => {
      res.status(200).json({ posts: posts });
    })
    .catch((error) => res.status(400).send(error));
});

router.post('/createpost', requireLogin, (req, res) => {
  const { title, body, photo } = req.body;

  req.user.password = undefined;

  const post = new Post({
    title,
    body,
    photo,
    postedBy: req.user,
  });
  post
    .save()
    .then((result) => {
      res.status(200).json({ post: result });
    })
    .catch((error) => res.status(400).send(error));
});

router.get('/myposts', requireLogin, (req, res) => {
  Post.find({ postedBy: req.user._id })
    .populate('postedBy', '_id name profilePicture')
    .then((myPosts) => {
      res.status(200).json({ myPosts });
    })
    .catch((error) => res.status(400).send(error));
});

router.put('/like', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate('comments.postedBy', '_id name profilePicture')
    .populate('postedBy', '_id name profilePicture')
    .exec((error, result) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        res.json(result);
      }
    });
});

router.put('/unlike', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $pull: { likes: req.user._id },
    },
    {
      new: true,
    }
  )
    .populate('comments.postedBy', '_id name profilePicture')
    .populate('postedBy', '_id name profilePicture')
    .exec((error, result) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        res.json(result);
      }
    });
});

router.put('/comment', requireLogin, (req, res) => {
  const comment = { text: req.body.text, postedBy: req.user._id };

  Post.findByIdAndUpdate(
    req.body.postId,
    {
      $push: { comments: comment },
    },
    {
      new: true,
    }
  )
    .populate('comments.postedBy', '_id name profilePicture')
    .populate('postedBy', '_id name profilePicture')
    .exec((error, result) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        res.json(result);
      }
    });
});

router.delete('/deletepost/:postId', requireLogin, (req, res) => {
  Post.findOne({ _id: req.params.postId })
    .populate('postedBy', '_id')
    .exec((err, post) => {
      if (err || !post) {
        return res.status(400).send(error);
      }
      if (post.postedBy._id.toString() === req.user._id.toString()) {
        post
          .remove()
          .then((result) => {
            res.status(200).json(result);
          })
          .catch((error) => res.status(400).send(error));
      }
    });
});

router.put('/deletecomment', requireLogin, (req, res) => {
  Post.findByIdAndUpdate(
    req.body.postId,
    { $pull: { comments: { _id: req.body.commentId } } },
    {
      new: true,
    }
  )
    .populate('comments.postedBy', '_id name')
    .populate('postedBy', '_id name')
    .exec((error, result) => {
      if (error) {
        return res.status(400).send(error);
      } else {
        res.json(result);
      }
    });
});

module.exports = router;
