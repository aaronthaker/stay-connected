const express = require('express');
const User = require("../models/user");
const router = express.Router();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

router.post("/signup", (req, res, next) => {
    bcrypt.hash(req.body.password, 10).then(hash => {
        const user = new User({
            email: req.body.email,
            password: hash
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
    User.find({ email: req.body.email })
        .then(user => {
            if (!user || user.length === 0) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            fetchedUser = user[0];
            return bcrypt.compare(req.body.password, user[0].password);
        })
        .then(result => {
            if (!result) {
                return res.status(401).json({
                    message: "Auth failed"
                });
            }
            const token = jwt.sign({ email: fetchedUser.email, userId: fetchedUser._id }, 'secret_lol', { expiresIn: '1h' });
            res.status(200).json({
                token: token,
                expiresIn: 3600,
                userId: fetchedUser._id
            });
        })
        .catch(err => {
            console.log(err);
            return res.status(401).json({
                message: "Auth failed",
                error: err
            });
        });
});

module.exports = router;
