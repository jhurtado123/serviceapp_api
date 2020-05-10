const Ad = require('../models/Ad');

const isOwner = (req, res, next) => {
  Ad.findOne({_id: req.params.id, owner: req.session.currentUser._id})
    .then (ad => {
      if (ad)  return next();
      return res.status(401).json({'data': 'Not autorized'})
    })
    .catch(error => {
      return res.status(401).json({'data': 'Not autorized'})
    });
};


module.exports = {
  isOwner,
};
