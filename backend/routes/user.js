const express = require('express');
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const checkAuth = require('../middleware/check-auth');
const profileController = require('../controllers/profile.controller');

router.post("/signup", (req, res, next) => {
  bcrypt.hash(req.body.password, 10).then(hash => {
    const user = new User({
      email: req.body.email,
      password: hash,
      profileImage: 'images/defaults/no-gender.jpg', // Set default profile image
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
          message: "Incorrect email or password. Please try again."
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
          email: fetchedUser.email,
          name: fetchedUser.name
        });
      }
    })
    .catch(err => {
      console.log(err);
    });
});

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

router.get('/:userId/matches', checkAuth, (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      User.find({ _id: { $in: user.matchedUsers } })
        .then((matchedUsers) => {
          res.status(200).json(matchedUsers);
        })
        .catch((error) =>
          res.status(500).json({ message: 'An error occurred while fetching matched users', error })
        );
    })
    .catch((error) => res.status(500).json({ message: 'An error occurred while fetching the user', error }));
});

router.put('/:userId/unmatch', (req, res, next) => {
  const userId = req.params.userId;
  const unmatchedUserId = req.body.unmatchedUserId;

  if (!unmatchedUserId) {
    return res.status(400).json({
      message: "Unmatched user ID is missing"
    });
  }

  User.findById(userId)
    .then(user => {
      if (!user) {
        return res.status(404).json({
          message: "User not found"
        });
      }

      user.matchedUsers = user.matchedUsers.filter(id => id.toString() !== unmatchedUserId);
      user.likedUsers = user.likedUsers.filter(id => id.toString() !== unmatchedUserId);

      user.save()
        .then(updatedUser => {
          res.status(200).json({
            message: "User unmatched and unliked successfully",
            user: updatedUser
          });
        })
        .catch(err => {
          res.status(500).json({
            error: err
          });
        });

    })
    .catch(err => {
      res.status(500).json({
        error: err
      });
    });
});

router.get("/:userId", checkAuth, (req, res, next) => {
  const { userId } = req.params;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user);
    })
    .catch((error) =>
      res.status(500).json({ message: "An error occurred while fetching the user", error })
    );
});

router.post("/change-password", checkAuth, (req, res, next) => {
  const { userId, currentPassword, newPassword } = req.body;

  User.findById(userId)
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      bcrypt.compare(currentPassword, user.password)
        .then((result) => {
          if (!result) {
            return res.status(401).json({ message: "Current password is incorrect" });
          }

          bcrypt.hash(newPassword, 10)
            .then((hash) => {
              user.password = hash;
              user.save()
                .then(() => res.status(200).json({ message: "Password changed successfully" }))
                .catch((error) => res.status(500).json({ message: "An error occurred while saving the new password", error }));
            })
            .catch((error) => res.status(500).json({ message: "An error occurred while hashing the new password", error }));
        })
        .catch((error) => res.status(500).json({ message: "An error occurred while checking the current password", error }));
    })
    .catch((error) => res.status(500).json({ message: "An error occurred while fetching the user", error }));
});

module.exports = router;
