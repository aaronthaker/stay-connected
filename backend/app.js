const bodyParser = require("body-parser");
const express = require("express");
const app = express();
// const cors = require('cors');
// app.use(cors());

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
    const event = req.body;
    console.log(event);
    res.status(201).json({
        message: 'Event added successfully'
    });
})

app.get('/api/events', (req, res, next) => {
    events = [{
            event: 'Visually Impaired Singles Speed Dating',
            location: 'New York City, NY',
            date: 'September 5th, 2020',
            description: 'Come meet other visually impaired singles in a fun and fast...',
            imagePath: '../assets/faces/face1.jpg',
            attending: false
        },
        // more events
    ];
    res.status(200).json({
        message: 'Events fetched successfully',
        events: events
    });
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