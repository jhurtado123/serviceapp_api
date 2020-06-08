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
    new Message({
      data: dataS.data,
      type: dataS.type,
      sender: dataS.sender,
      chat: dataS.chatId,
      isReaded,
      createdAt: dataS.date
    }).save();

    if (dataS.type === 'renegotiation-resolve') {
      await Message.find({chat: dataS.chatId, type: 'renegotiation'}).remove();
      if (dataS.data.status) {
        await Chat.findOneAndUpdate({_id: dataS.chatId}, {price: dataS.data.content});
      }
    }
    if (dataS.type === 'deal-resolve') {
      await Message.find({chat: dataS.chatId, type: 'new-deal'}).remove();
      if (dataS.data.status) {
        const appointmentDate = new Date(dataS.data.content);

        const chat = await Chat.findOne({_id: dataS.chatId}).populate('buyer');
        await new Appointment({
          seller: chat.seller,
          chat: chat._id,
          buyer: chat.buyer,
          ad: chat.ad,
          date: new Date(appointmentDate.setHours(appointmentDate.getHours() + 2)),
          pendingTokens: chat.price,
          location: {type: 'Point', coordinates: chat.buyer.location.coordinates}
        }).save();
        await User.findOneAndUpdate({_id: chat.buyer}, {$inc: {'wallet.tokens': -chat.price}});
      }
    }
    socket.in(dataS.chatId).emit('chat:message', dataS)
  });

  socket.on('call:new-call', async (data) => {
    const connectedSockets = io.sockets.adapter.rooms[data.chatId];

    if ((connectedSockets && connectedSockets.length <= 1) || !connectedSockets) {
      io.to(data.chatId).emit('call:declined-call-no-connected', data);
      return;
    }
    socket.in(data.chatId).emit('call:receiving-call', data)
  });

  socket.on('call:decline-call', (data) => {
    socket.in(data.chatId).emit('call:declined-call', data);
  });

  socket.on('call:accept-call', (data) => {
    socket.in(data.chatId).emit('call:accepted-call', data);
  });

  socket.on('call:handUp-call', (data) => {
    socket.in(data.chatId).emit('call:finished', data);
  });

  socket.on('call:handShake', (data) => {
    socket.in(data.chatId).emit('call:handShakeRequest', data);
  });

  socket.on('call:handShakeAccept', (data) => {
    socket.in(data.chatId).emit('call:handShakeRequestAccepted', data);
  });

  socket.on('call:handUpDestroyPeer', (data) => {
    socket.in(data.chatId).emit('call:handUpDestroyPeerEmit', data);
  });

  socket.on('call:toggle-videocam', (data) => {
    socket.in(data.chatId).emit('call:toggled-videocam', data);
  });

});


module.exports = socket;