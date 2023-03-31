const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const uniqueValidator = require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
  name: { type: String },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  gender: { type: String, required: false},
  age: { type: Number, required: false},
  location: { type: String, required: false},
  bio: { type: String, required: false},
  likedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  matchedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  dislikedUsers: [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  interests: {
    type: [String],
    default: [],
  },
  // profilePicture: { type: String, required: true }
});

module.exports = mongoose.model('User', userSchema)
