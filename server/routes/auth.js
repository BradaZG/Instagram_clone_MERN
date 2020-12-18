const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const User = require('../models/User');

router.post(
  '/signup',
  [
    check('name', 'Name is required...').not().isEmpty(),
    check('email', 'Please include a valid email...').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters...'
    ).isLength({ min: 6 }),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { name, email, password } = req.body;

    // See if user exists
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          return res.status(400).json({ error: 'User already exists!' });
        }

        bcrypt.hash(password, 10).then((hashedPassword) => {
          const user = new User({ name, email, password: hashedPassword });
          user
            .save()
            .then((response) => {
              res.status(200).json({ msg: 'Saved successfully!' });
            })
            .catch((error) => res.status(400).send(error));
        });
      })
      .catch((error) => res.status(400).send(error));
  }
);

router.post(
  '/signin',
  [
    check('email', 'Please include a valid email...').isEmail(),
    check('password', 'Password is required...').not().isEmpty(),
  ],
  (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ error: errors.array() });
    }

    const { email, password } = req.body;
    /* if (!email || !password) {
    res.status(400).json({error: "Please include valid email and password... "})
  } */
    User.findOne({ email: email })
      .then((savedUser) => {
        if (!savedUser) {
          return res.status(400).json({ error: 'Invalid credentials!' });
        }

        bcrypt
          .compare(password, savedUser.password)
          .then((isMatch) => {
            if (isMatch) {
              const token = jwt.sign(
                { _id: savedUser._id },
                process.env.JWT_SECRET,
                { expiresIn: 360000 }
              );
              const { _id, name, email, followers, following } = savedUser;
              res
                .status(200)
                .json({
                  token,
                  user: { _id, name, email, followers, following },
                });
            } else {
              return res.status(400).json({ error: 'Invalid credentials!' });
            }
          })
          .catch((error) => res.status(400).send(error));
      })
      .catch((error) => res.status(400).send(error));
  }
);

module.exports = router;
