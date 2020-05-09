const express = require('express');
const router = express.Router();
const User = require('../../models/User');

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

module.exports = router;
