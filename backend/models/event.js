const mongoose = require("mongoose");

const eventSchema = mongoose.Schema({
    eventTitle: { type: String, required: true },
    location: { type: String, required: true },
    date: { type: String, required: true },
    description: { type: String, required: true }
})

module.exports = mongoose.model('Event', eventSchema)