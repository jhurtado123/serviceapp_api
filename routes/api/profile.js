const express = require('express');
const router = express.Router();
const User = require('../../models/User');
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
    console.log("Los puntos", userpoints)
    const level = await Level.find({ "maxpoints": {$gte: userpoints}, "minpoints": {$lte: userpoints}})
    .then((level) => {
      console.log(level, userpoints)
      return res.status(200).json(level)
    })
    .catch((error) => {console.log(error)})
    
})

module.exports = router;
