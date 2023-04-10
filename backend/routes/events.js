const express = require('express');
const Event = require("../models/event");
const multer = require('multer');
const router = express.Router();
const checkAuth = require("../middleware/check-auth");

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpeg',
  'image/jpg': 'jpg'
};

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const isValid = MIME_TYPE_MAP[file.mimetype];
    let error = new Error('Invalid mime type');
    if (isValid) {
      error = null;
    }
    cb(error, 'backend/images/events');
  },
  filename: (req, file, cb) => {
    const name = file.originalname.toLowerCase().split(' ').join('-');
    const ext = MIME_TYPE_MAP[file.mimetype];
    cb(null, name + '-' + Date.now() + '.' + ext);
  }
});

router.post('', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  const url = req.protocol + '://' + req.get('host');
  let imagePath = null;
  if (req.file) {
    imagePath = url + '/images/events/' + req.file.filename;
  }
  const event = new Event({
    title: req.body.title,
    location: req.body.location,
    date: req.body.date,
    description: req.body.description,
    imagePath: imagePath,
    creator: req.userData.userId
  });
  event.save().then(createdEvent => {
    res.status(201).json({
      message: 'Event added successfully',
      eventId: createdEvent._id,
      event: {
        ...createdEvent.toObject({ getters: true }),
        creator: createdEvent.creator.toString()
      }
    });
  });
});

router.put('/:id', checkAuth, multer({ storage: storage }).single('image'), (req, res, next) => {
  let imagePath = req.body.imagePath;
  const removeImage = req.body.removeImage === 'true';

  if (req.file) {
    const url = req.protocol + '://' + req.get('host');
    imagePath = url + '/images/events/' + req.file.filename;
  } else if (removeImage) {
    imagePath = '';
  }
  const event = new Event({
    _id: req.body.id,
    title: req.body.title,
    location: req.body.location,
    date: req.body.date,
    description: req.body.description,
    imagePath: imagePath,
    creator: req.userData.userId
  })
  Event.updateOne({ _id: req.params.id, creator: req.userData.userId }, event).then(result => {
    if (result.modifiedCount > 0) {
      res.status(200).json({ message: "Update successful!" });
    } else {
      res.status(401).json({ message: "Not authorized." })
    }
  })
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
      res.status(200).json({ message: "Deletion successful!" });
    } else {
      res.status(401).json({ message: "Not authorized." })
    }
  })
});

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
