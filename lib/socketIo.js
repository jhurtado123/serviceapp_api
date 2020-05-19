const socket_io = require('socket.io');
const io = socket_io();
const Message = require('../models/Message');
const Chat = require('../models/Chat');

const socket = {};

socket.io = io;

io.on('connection', (socket) => {

  socket.on('room:join', function (room) {
    socket.join(room);
  });

  socket.on('room:leave', function (room) {
    socket.leave(room);
  });

  socket.on('chat:message', async (dataS) => {
    const connectedSockets = io.sockets.adapter.rooms[dataS.chatId];
    let isReaded = false;
    if (connectedSockets) {
      isReaded = io.sockets.adapter.rooms[dataS.chatId].length > 1;
    }
    new Message({ data: dataS.data, type: dataS.type, sender: dataS.sender, chat: dataS.chatId, isReaded, createdAt: dataS.date}).save();

    if (dataS.type === 'renegotiation-resolve') {
      await Message.find({chat: dataS.chatId, type:'renegotiation'}).remove();
      if (dataS.data.status) {
        await Chat.findOneAndUpdate({_id: dataS.chatId}, {price: dataS.data.content});
      }
    }
    let dateFromData = new Date(dataS.date);
    //dataS.date = new Date(dateFromData.setHours(dateFromData.getHours() + 2));
    socket.in(dataS.chatId).emit('chat:message', dataS)
  });
  // socket.on('notification:count', () => {
  //   socket.emit('notification:count', {
  //     value: 2
  //   });
  // });
  socket.emit('notification:count', {
    value: 1
  });
});


module.exports = socket;