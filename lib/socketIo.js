const socket_io = require('socket.io');
const io = socket_io();
const Message = require('../models/Message');
const Chat = require('../models/Chat');
const Appointment = require('../models/Appointment');
const User = require('../models/User');

const socket = {};

socket.io = io;

io.on('connection', (socket) => {
  
  if (socket.handshake.query.id) {
    socket.id = socket.handshake.query.id;
  }

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
    if (dataS.type === 'deal-resolve') {
      await Message.find({chat: dataS.chatId, type:'new-deal'}).remove();
      if (dataS.data.status) {
        const chat = await Chat.findOne({_id: dataS.chatId}).populate('buyer');
        await new Appointment({seller: chat.seller, chat: chat._id, buyer: chat.buyer, ad: chat.ad, date: dataS.date, pendingTokens: chat.price, location: {type: 'Point', coordinates: chat.buyer.location.coordinates}}).save();
        await User.findOneAndUpdate({_id: chat.buyer}, {$inc : {'wallet.tokens': -chat.price }});
      }
    }
    socket.in(dataS.chatId).emit('chat:message', dataS)
  });

});


module.exports = socket;