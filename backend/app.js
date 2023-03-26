const bodyParser = require("body-parser");
const express = require("express");
const app = express();
const mongoose = require('mongoose');
const cors = require('cors');
app.use(cors());

const eventsRoutes = require("./routes/events");
const userRoutes = require("./routes/user");
const messagesRoutes = require("./routes/messages");
const usersRoutes = require("./routes/users"); // Add this line

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

const server = require('http').Server(app);
const io = require('socket.io')(server);

io.on('connection', socket => {
  console.log('Client connected');
  socket.on('disconnect', () => {
    console.log('Client disconnected');
  });
});

module.exports = app;
