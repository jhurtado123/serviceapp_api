const User = require('../models/User');
const socket = require('../lib/socketIo');


module.exports = async function createNofifications(id, options) {
  let notificationNotReaded = [];
  try {
    const user = await User.findOne({'_id': id});
    user.notifications.push({ 'title': options.title, 'href': options.href, 'type': options.type });
    user.save();
    for (let i = 0; i < user.notifications.length; i++) {
      const notification = user.notifications[i];
      if(!notification.isReaded){
        notificationNotReaded.push(notification)
      }
    } 
    Object.keys(socket.io.sockets.connected).forEach((socketId) => {
      const socketCustomID = socket.io.sockets.connected[socketId].id;
      if (socketCustomID == id) {
        socket.io.to(socketId).emit('notification:count', {
          value: notificationNotReaded.length,
          notification: 1
        });
      }
    });


    return true;
  } catch (err) {
    console.log(err);
  }
};