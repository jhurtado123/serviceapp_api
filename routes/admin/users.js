const express = require("express");
const router = express.Router();
const User = require('../../models/User');

router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    return res.render('users/users', {users});
  } catch (e) {
    return next(e);
  }
});




module.exports = router;