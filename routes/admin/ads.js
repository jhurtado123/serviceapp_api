const express = require("express");
const router = express.Router();
const Ad = require('../../models/Ad');

router.get('/', async (req, res, next) => {
  try {
    const ads = await Ad.find().populate('owner category');
    return res.render('ads/ads', {ads});
  } catch (e) {
    return next(e);
  }
});




module.exports = router;