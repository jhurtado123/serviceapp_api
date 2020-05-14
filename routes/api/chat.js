const express = require("express");
const router = express.Router();
const autMiddleware = require('../../middlewares/authMiddleware');
const Chat = require('../../models/Chat');
const Ad = require('../../models/Ad');
const app = require('../../app');

const io = require('socket.io')();
app.socketIO = io;


router.get('/', autMiddleware.checkIfLoggedIn, async (req, res, next) => {

  const {currentUser} = req.session;
  try {
    const chats = await Chat.find({$or: [{buyer: currentUser}, {seller: currentUser}]});

    return res.status(200).json({chats});

  } catch (e) {
    return next(e);
  }
});

app.socketIO.on('connection', (socket) => {
  socket.on('room:join', function (room) {
    socket.join(room);
  });
  socket.on('chat:message', data => {
    let isReaded = Object.keys(app.io.sockets.adapter.rooms[data.chatId].sockets).length > 1;
    new Message({message: data.message, sender: data.sender, chat: data.chatId, isReaded}).save();
    socket.in(data.chatId).emit('chat:message', data)
  });
});

router.get('/:id', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const {id} = req.params;
  try {
    const chat = await Chat.findOne({_id: id, deleted_at: null, $or: [{buyer: currentUser}, {seller: currentUser}]}).populate('ad seller');

    return res.status(200).json({chat});

  } catch (e) {
    return res.status(401).json({data: 'unauthorized'});
  }
});

router.post('/', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const {adId} = req.body;
  try {
    const ad = await Ad.findOne({_id: adId});
    const chat = await Chat.create({buyer: currentUser, seller: ad.owner, price: ad.price, ad});

    return res.status(200).json({data: chat._id});

  } catch (e) {
    return res.status(401).json({data: 'unauthorized'});
  }
});

module.exports = router;