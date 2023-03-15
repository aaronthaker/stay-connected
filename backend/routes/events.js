const express = require('express');
const Event = require("../models/event")
const router = express.Router();

router.post('', (req, res, next) => {
    const event = new Event({
        title: req.body.title,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description
    });
    event.save().then(createdEvent => {
        res.status(201).json({
            message: 'Event added successfully',
            eventId: createdEvent._id
        });
    });
})

router.get('', (req, res, next) => {
    Event.find().then(documents => {
        res.status(200).json({
            message: 'Events fetched successfully',
            events: documents
        });
    })
})

router.delete('/:id', (req, res, next) => {
    Event.deleteOne({ _id: req.params.id }).then(() => {
        console.log("Deleted on server")
        res.status(200).json({ message: 'Event deleted!' });
    })
});

router.put('/:id', (req, res, next) => {
    const event = new Event({
        _id: req.body.id,
        title: req.body.title,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description
    })
    Event.updateOne({ _id: req.params.id }, event).then(result => {
        console.log(event);
        res.status(200).json({ message: "Updated successfully." })
    })
})

router.get('/:id', (req, res, next) => {
    Event.findById(req.params.id).then(event => {
        if (event) {
            res.status(200).json(event);
        } else {
            res.status(404).json({ message: 'Event not found.' })
        }
    })
})

module.exports = router;