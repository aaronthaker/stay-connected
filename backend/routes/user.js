const express = require('express');
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/check-auth');

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash,
        });
        user.save()
            .then(result => {
                res.status(201).json({
                    message: 'User created',
                    result: result
                });
            })
            .catch(err => {
                res.status(500).json({
                    error: err
                });
            });
    });
});

router.post("/login", (req, res, next) => {
  let fetchedUser;
  User.findOne({ email: req.body.email })
    .then(user => {
      if (user === null) {
        return res.status(401).json({
          message: "Auth failed"
        });
      } else {
          fetchedUser = user;
          return bcrypt.compare(req.body.password, user.password);
      }
    })
    .then(result => {
      if (!result) {
        console.log("Email matched but password did not.")
        return res.status(401).json({
          message: "Password was incorrect"
        });
      }
      if (result === true) {
        const token = jwt.sign(
          { email: fetchedUser.email, userId: fetchedUser._id },
          "secret_lol",
          { expiresIn: "1h" }
        );
        res.status(200).json({
          token: token,
          expiresIn: 3600,
          userId: fetchedUser._id,
          email: fetchedUser.email
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

// Update likedUsers array
router.put('/:userId/like', checkAuth, (req, res, next) => {
  const { userId } = req.params;
  const { likedUserId } = req.body;

  User.findById(likedUserId)
    .then((likedUser) => {
      if (likedUser.likedUsers.includes(userId)) {
        // Add to matchedUsers and likedUsers for both users
        const updateUser = (userId, matchedUserId) =>
          User.findByIdAndUpdate(
            userId,
            {
              $addToSet: {
                likedUsers: matchedUserId,
                matchedUsers: matchedUserId,
              },
            },
            { new: true, useFindAndModify: false }
          );

        Promise.all([
          updateUser(userId, likedUserId),
          updateUser(likedUserId, userId),
        ])
          .then(() =>
            res.status(200).json({ message: 'User liked successfully', matched: true })
          )
          .catch((error) =>
            res.status(500).json({ message: 'An error occurred while liking the user', error })
          );
      } else {
        User.findByIdAndUpdate(
          userId,
          { $addToSet: { likedUsers: likedUserId } },
          { new: true, useFindAndModify: false }
        )
          .then(() => res.status(200).json({ message: 'User liked successfully', matched: false }))
          .catch((error) => res.status(500).json({ message: 'An error occurred while liking the user', error }));
      }
    })
    .catch((error) => res.status(500).json({ message: 'An error occurred while checking for a match', error }));
});

// Update dislikedUsers array
router.put('/:userId/dislike', checkAuth, (req, res, next) => {
  const { userId } = req.params;
  const { dislikedUserId } = req.body;

  User.findByIdAndUpdate(
    userId,
    { $addToSet: { dislikedUsers: dislikedUserId } },
    { new: true, useFindAndModify: false }
  )
    .then(() => res.status(200).json({ message: 'User disliked successfully' }))
    .catch((error) => res.status(500).json({ message: 'An error occurred while disliking the user', error }));
});

// Update matchedUsers arrays for both users
router.put('/match', checkAuth, (req, res, next) => {
  const { userId1, userId2 } = req.body;

  const updateMatchedUsers = (userId, matchedUserId) =>
    User.findByIdAndUpdate(
      userId,
      { $addToSet: { matchedUsers: matchedUserId } },
      { new: true, useFindAndModify: false }
    );

  Promise.all([updateMatchedUsers(userId1, userId2), updateMatchedUsers(userId2, userId1)])
    .then(() => res.status(200).json({ message: 'Users matched successfully' }))
    .catch((error) => res.status(500).json({ message: 'An error occurred while matching the users', error }));
});

module.exports = router;
