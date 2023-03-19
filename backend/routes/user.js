const express = require('express');
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            name: req.body.name,
            email: req.body.email,
            password: hash,
            gender: req.body.gender
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

module.exports = router;
