const http = require('http');
const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const path = require('path');

const mongoose = require('mongoose');
const cors = require('cors');

app.use(express.json({ limit: '50mb' }));
app.use('/images', express.static(path.join(__dirname, 'images')));

// Increase payload size to 50mb
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use(cors());

const eventsRoutes = require("./routes/events");
const userRoutes = require("./routes/user");
const messagesRoutes = require("./routes/messages");
const usersRoutes = require("./routes/users");

mongoose.connect('mongodb+srv://190088169:MX2mOQCX1GUrktZY@cluster0.5lzxrui.mongodb.net/stay-connected?retryWrites=true&w=majority')
  .then(() => {
    console.log('Connected to database!')
  })
  .catch(() => {
    console.log('Connection to database failed.')
  })
const Event = require('./models/event');
const e = require("express");

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
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  )
  next();
});

app.use('/api/home', (req, res, next) => {
  res.status(200).json({
    message: "Successful"
  })
})

app.use('/api/events', eventsRoutes);
app.use('/api/user', userRoutes);
app.use('/api/messages', messagesRoutes);
app.use('/api/users', usersRoutes);

const socket = require('./socket');
const server = http.createServer(app);
socket.init(server);

module.exports = app;
