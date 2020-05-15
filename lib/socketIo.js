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
    new Message({content: data.content, type: data.type, sender: data.sender, chat: data.chatId, isReaded, createdAt: data.date}).save();

    let dateFromData = new Date(data.date);
    data.date = new Date(dateFromData.setHours(dateFromData.getHours() + 2));
    socket.in(data.chatId).emit('chat:message', data)
  });
});


module.exports = socket;