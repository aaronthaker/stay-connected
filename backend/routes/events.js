const express = require('express');
const Event = require("../models/event")
const router = express.Router();
const checkAuth = require("../middleware/check-auth")

router.post('', checkAuth, (req, res, next) => {
    const event = new Event({
        title: req.body.title,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description,
        creator: req.userData.userId
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

router.delete('/:id', checkAuth, (req, res, next) => {
    Event.deleteOne({ _id: req.params.id, creator: req.userData.userId }).then(result => {
        if (result.deletedCount > 0) {
          console.log("Deleted on server");
          res.status(200).json({message: "Deletion successful!"});
        } else {
          res.status(401).json({ message: "Not authorized." })
        }
    })
});

router.put('/:id', checkAuth, (req, res, next) => {
    const event = new Event({
        _id: req.body.id,
        title: req.body.title,
        location: req.body.location,
        date: req.body.date,
        description: req.body.description
    })
    Event.updateOne({ _id: req.params.id, creator: req.userData.userId }, event).then(result => {
      if (result.modifiedCount > 0) {
        res.status(200).json({message: "Update successful!"});
      } else {
        res.status(401).json({ message: "Not authorized." })
      }
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
