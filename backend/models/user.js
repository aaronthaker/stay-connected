const express = require('express');
const mongoose = require("mongoose");
const router = express.Router();
const jwt = require("jsonwebtoken");
// const uniqueValidator = require("mongoose-unique-validator")

const userSchema = mongoose.Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // name: { type: String, required: true },
  // profilePicture: { type: String, required: true }
});


router.post("/login", (req, res, next) => {
    User.find({ email: req.body.email })
        .then(user => {
            if (!user) {
                return res.status(401).json({
                    message: "Auth failed"
                })
            }
            return bcrypt.compare(req.body.password, user.password)
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign({
                    email: user.email,
                    userId: user._id
                },
                'secret_lol', { expiresIn: '1h' }
            );
        })
        .catch(err => {
            return res.status(401).json({
                message: "Auth failed"
            })
        })
})

module.exports = mongoose.model('User', userSchema)
