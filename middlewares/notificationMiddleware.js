const User = require('../models/User');
const socket = require('../lib/socketIo');

module.exports = async function createNofifications (id, options) {
  try{
    const user = await User.findOne({ '_id': id })
        user.notifications.push({ 'title': options.title, 'href': options.href , 'type': options.type });
        user.save();
        console.log("ENTRAAAAA", socket.io.sockets.connected);
        console.log("LA ID", id)
    socket.io.sockets.connected[id].emit('notification:count', {
      value: 1
    });

        return true;
  }
  catch(err) {
    console.log(err);
  }
};