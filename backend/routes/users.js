const express = require('express');
const router = express.Router();
const User = require('../models/user');
const profileController = require('../controllers/profile.controller');

router.get('/', (req, res, next) => {
  User.find()
    // FIX BELOW CYBERSEC ISSUE - sending back too much data in GET request
    // .select('email') // Replace 'email' with any other fields to return
    .then(users => {
      res.status(200).json({
        message: "Successful",
        users: users
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.put('/:userId', (req, res, next) => {
  const userId = req.params.userId;
  User.findByIdAndUpdate(userId, req.body, { new: true })
    .then(updatedUser => {
      if (!updatedUser) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      res.status(200).json({
        message: "User updated successfully",
        user: updatedUser
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get('/:userId', (req, res, next) => {
  User.findById(req.params.userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }
      res.status(200).json({
        message: "Successful",
        user: user
      });
    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.post(
  "/:userId/upload-profile-picture",
  // checkAuth,
  profileController.upload.single('profileImage'),
  profileController.uploadProfilePicture
);

module.exports = router;
