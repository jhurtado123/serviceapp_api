const User = require('../models/User');
const socket = require('../lib/socketIo');

<<<<<<< HEAD
module.exports = async function createNofifications (id, options) {
  try{
    const user = await User.findOne({ '_id': id })
        user.notifications.push({ 'title': options.title, 'href': options.href , 'type': options.type });
        user.save();
        console.log("ENTRAAAAA", socket.io.sockets.connected);
        console.log("LA ID", id)
    socket.io.sockets.connected[id].emit('notification:count', {
      value: 1
=======
module.exports = async function createNofifications(id, options) {
  try {
    const user = await User.findOne({'_id': id})
    user.notifications.push({'title': options.title, 'href': options.href});
    user.save();

    Object.keys(socket.io.sockets.connected).forEach((socketId) => {
      const socketCustomID = socket.io.sockets.connected[socketId].id;
      if (socketCustomID === id) {
        socket.io.to(socketId).emit('notification:count', {
          //Todo
          value: 1
        });
      }
>>>>>>> dev
    });


    return true;
  } catch (err) {
    console.log(err);
  }
};