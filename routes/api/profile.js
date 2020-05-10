const express = require('express');
const router = express.Router();
const User = require('../../models/User');
const Ad = require('../../models/Ad');
const Level = require('../../models/Level');

/* GET user */
router.get('/', (req, res, next) => {
  const { currentUser } = req.session;
  User.findById(currentUser._id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch((error) => {
       return res.status(500).json({ data: 'Server error' });
    })
});

router.get('/level', async (req, res, next) => {
    const { currentUser } = req.session;
    const userpoints = await User.findById(currentUser._id)
    .then((user) => {
      return user.points;
    })
    .catch((error) => console.log(error))
    const level = await Level.find({ "maxpoints": {$gte: userpoints}, "minpoints": {$lte: userpoints}})
    .then((level) => {
      return res.status(200).json(level)
    })
    .catch((error) => {
      next(error);
    })
    
})

router.get('/ads', (req, res,next) => {
  const user = req.session.currentUser;
  if (!user) {
    next();
  }

  Ad.find({owner: user._id, deleted_at: null}).populate('category')
    .then(ads => {
      return res.status(200).json({ads});
    })
    .catch(error => {
      next(error);
    })

});

router.get('/ads/removed', (req, res,next) => {
  const user = req.session.currentUser;
  if (!user) {
    next();
  }

  Ad.find({owner: user._id, deleted_at: { $ne: null }}).populate('category')
    .then(ads => {
      return res.status(200).json({ads});
    })
    .catch(error => {
      next(error);
    })

});

module.exports = router;
