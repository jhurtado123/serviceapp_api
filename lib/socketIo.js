const socket_io = require('socket.io');
const io = socket_io();
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
   // let isReaded = Object.keys(io.sockets.adapter.rooms[data.chatId].sockets).length > 1;
    //console.log(isReaded);
    //new Message({message: data.message, sender: data.sender, chat: data.chatId, isReaded}).save();
    socket.in(data.chatId).emit('chat:message', data)
  });
});



module.exports = socket;