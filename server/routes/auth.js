const express = require('express');
const router = express.Router();
const { check, validationResult } = require('express-validator');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const sendgridTransport = require('nodemailer-sendgrid-transport');

const User = require('../models/User');

const transporter = nodemailer.createTransport(
  sendgridTransport({
    auth: {
      api_key: process.env.SENDGRID_API,
    },
  })
);

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

    const { name, email, password, profilePicture } = req.body;

    // See if user exists
    User.findOne({ email: email })
      .then((savedUser) => {
        if (savedUser) {
          return res.status(400).json({ error: 'User already exists!' });
        }

        bcrypt.hash(password, 10).then((hashedPassword) => {
          const user = new User({
            name,
            email,
            password: hashedPassword,
            profilePicture,
          });
          user
            .save()
            .then((response) => {
              // transporter.sendMail({
              //     to:user.email,
              //     from:"no-reply@instagram-clone.com",
              //     subject:"Signup successful",
              //     html:"<h1>Welcome to Instagram clone!</h1>"
              // })
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
                process.env.JWT_SECRET
                // { expiresIn: 360000 }
              );
              const {
                _id,
                name,
                email,
                followers,
                following,
                profilePicture,
              } = savedUser;
              res.status(200).json({
                token,
                user: {
                  _id,
                  name,
                  email,
                  followers,
                  following,
                  profilePicture,
                },
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

router.post('/resetpassword', (req, res) => {
  crypto.randomBytes(32, (err, buffer) => {
    if (err) {
      console.log(err);
    }
    const token = buffer.toString('hex');
    User.findOne({ email: req.body.email })
      .then((user) => {
        if (!user) {
          return res.status(400).json({ error: "User doesn't exist..." });
        }
        user.resetToken = token;
        user.expireToken = Date.now() + 3600000;
        user.save().then((result) => {
          transporter.sendMail({
            to: user.email,
            from: 'no-reply@instagram-clone.com',
            subject: 'Password reset',
            html: `
                     <p>You requested a password reset</p>
                     <h5>Click <a href="${process.env.EMAIL}/resetpassword/${token}">here</a> to reset password</h5>
                     `,
          });
          console.log(token);
          res.json({ message: 'Check your email...' });
        });
      })
      .catch((error) => res.status(400).send(error));
  });
});

router.post('/newpassword', (req, res) => {
  const newPassword = req.body.password;
  const sentToken = req.body.token;
  User.findOne({ resetToken: sentToken, expireToken: { $gt: Date.now() } })
    .then((user) => {
      if (!user) {
        return res.status(400).json({ error: 'Session expired, try again...' });
      }
      bcrypt.hash(newPassword, 10).then((hashedpassword) => {
        user.password = hashedpassword;
        user.resetToken = undefined;
        user.expireToken = undefined;
        user.save().then((saveduser) => {
          res.json({ message: 'Password updated!' });
        });
      });
    })
    .catch((error) => res.status(400).send(error));
});

module.exports = router;
