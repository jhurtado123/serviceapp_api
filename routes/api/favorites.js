const express = require("express");
const router = express.Router();
const autMiddleware = require('../../middlewares/authMiddleware');
const User = require('../../models/User');
const Ad = require('../../models/Ad');


router.get('/', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  try {
    const favoritesUser =  await User.findOne({_id: currentUser._id}, {_id:0, favorites:1}).populate({
      path: 'favorites',
      populate : {
        path : 'category'
      },
      model: 'Ad'
    });
    return res.status(200).json({favoritesUser});
  } catch (e) {
    return next(e);
  }
});

router.delete('/:id', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const {id} = req.params;
  try {
    const userNew = await User.findOneAndUpdate({_id: currentUser._id}, { $pullAll: {favorites: [id]}});
    return res.status(200).json({userNew});
  } catch (e) {
    return next(e);
  }
});

router.put('/:id', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const {id} = req.params;
  try {
    const userNew = await User.findOneAndUpdate({_id: currentUser._id}, { $push: {favorites: id }});
    return res.status(200).json({userNew});
  } catch (e) {
    return next(e);
  }
});

module.exports = router;