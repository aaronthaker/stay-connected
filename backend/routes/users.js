const express = require('express');
const router = express.Router();
const User = require('../models/user');

router.get('/', (req, res, next) => {
  User.find()
    .select('email') // Replace 'email' with any other fields you want to return
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

module.exports = router;
