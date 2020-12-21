const mongoose = require('mongoose');
const { ObjectId } = mongoose.Schema.Types;

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  resetToken: String,
  expireToken: Date,
  profilePicture: {
    type: String,
    default:
      'https://res.cloudinary.com/bradazg/image/upload/v1608337018/noProfile_bfngzo.png',
  },
  followers: [{ type: ObjectId, ref: 'User' }],
  following: [{ type: ObjectId, ref: 'User' }],
});

const User = mongoose.model('User', userSchema);

module.exports = User;
