const express = require("express");
const router = express.Router();
const autMiddleware = require('../../middlewares/authMiddleware');
const Chat = require('../../models/Chat');
const Ad = require('../../models/Ad');
const Message = require('../../models/Message');
const createNofifications = require ('../../middlewares/notificationMiddleware');




router.get('/', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  try {
    const response = [];
    const chats = await Chat.find({$or: [{buyer: currentUser}, {seller: currentUser}]}).sort({createdAt: -1}).populate('ad seller buyer');
    for (const chat of chats) {
      let messagesFrom = chat.seller === currentUser ? chat.buyer._id : chat.seller._id;
      const chatMessages = await Message.count({chat: chat._id, isReaded: false, sender: messagesFrom});
      response.push({chat, unReadMessages: chatMessages});
    }
    return res.status(200).json({response});

  } catch (e) {
    return next(e);
  }
});

router.get('/:id/messages', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const {id} = req.params;
  try {
    const messages = await Message.find({chat: id}).populate('chat');
    return res.status(200).json({messages});

  } catch (e) {
    return res.status(401).json({data: 'unauthorized'});
  }
});


router.get('/:id', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const {id} = req.params;
  try {
    await Message.update({chat: id, isReaded: false, sender: {$ne : currentUser}}, {$set: {isReaded: true}}, {"multi": true});
    const chat = await Chat.findOne({_id: id, deleted_at: null, $or: [{buyer: currentUser}, {seller: currentUser}]}).populate('ad seller buyer');

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
    console.log("USER", ad.owner)
    createNofifications(ad.owner,{'title': 'Tienes un nuevo chat', 'href': `/chats/${adId}`});
    return res.status(200).json({data: chat._id});

  } catch (e) {
    return res.status(401).json({data: 'unauthorized'});
  }
});

module.exports = router;