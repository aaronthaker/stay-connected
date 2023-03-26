const socketIO = require('socket.io');

let io;

module.exports = {
  init: (httpServer) => {
    io = socketIO(httpServer, {
      cors: {
        origin: '*',
        methods: ['GET', 'POST', 'PATCH']
      }
    });
    return io;
  },
  getIO: () => {
    if (!io) {
      throw new Error('Socket.IO not initialized!');
    }
    return io;
  }
};
