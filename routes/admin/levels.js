const express = require("express");
const router = express.Router();
const Level = require('../../models/Level');

router.get('/', async (req, res, next) => {
  try {
    const levels = await Level.find();
    return res.render('levels/levels', {levels});
  } catch (e) {
    return next(e);
  }
});




module.exports = router;