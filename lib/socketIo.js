const socket_io = require('socket.io');
const io = socket_io();
const Message = require('../models/Message');
const socket = {};

socket.io = io;

io.on('connection', (socket) => {

  socket.on('room:join', function (room) {
    socket.join(room);
  });

  socket.on('room:leave', function (room) {
    socket.leave(room);
  });

  socket.on('chat:message', data => {
    const connectedSockets = io.sockets.adapter.rooms[data.chatId];
    let isReaded = false;
    if (connectedSockets) {
      isReaded = io.sockets.adapter.rooms[data.chatId].length > 1;
    }
    new Message({content: data.content, sender: data.sender, chat: data.chatId, isReaded, createdAt: data.date}).save();

    socket.in(data.chatId).emit('chat:message', data)
  });
});


module.exports = socket;