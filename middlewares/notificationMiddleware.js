const User = require('../models/User');

module.exports = async function createNofifications (id, options) {
  try{
    const user = await User.findOne({ '_id': id })
        user.notifications.push({ 'title': options.title, 'href': options.href });
        user.save();
        return true;
  }
  catch(err) {
    console.log(err);
  }
};