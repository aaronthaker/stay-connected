const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
// const cors = require('cors');
// app.use(cors());

mongoose.connect('mongodb+srv://190088169:MX2mOQCX1GUrktZY@cluster0.5lzxrui.mongodb.net/stay-connected?retryWrites=true&w=majority')
    .then(() => {
        console.log('Connected to database!')
    })
    .catch(() => {
        console.log('Connection to database failed.')
    })
const Event = require('./models/event');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));

app.use((req, res, next) => {
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader(
        "Access-Control-Allow-Headers",
        "Origin, X-Requested-With, Content-Type, Accept"
    );
    res.setHeader(
        "Access-Control-Allow-Methods",
        "GET, POST, PATCH, DELETE, OPTIONS"
    )
    next();
});

app.post("/api/events", (req, res, next) => {
    const event = new Event({
        title: req.body.title,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description
    });
    event.save();
    res.status(201).json({
        message: 'Event added successfully'
    });
})

app.get('/api/events', (req, res, next) => {
    Event.find().then(documents => {
        res.status(200).json({
            message: 'Events fetched successfully',
            events: documents
        });
    })
})


app.use('/api/home', (req, res, next) => {
    people = [
        { id: "3827432487", name: 'Hash Farnsworth', photo: '../src/assets/faces/face1.jpg' },
        { id: "3224323233", name: 'Jane', photo: '../src/assets/faces/face2.jpg' },
        { id: "3243423423", name: 'Jack', photo: '../src/assets/faces/face3.jpg' },
        { id: "4324323232", name: 'Jill', photo: '../src/assets/faces/face3.jpg' }
    ];
    res.status(200).json({
        message: "Successful",
        people: people
    })
})

app.use((req, res, next) => {
    res.send("Hello from express")
})

module.exports = app;