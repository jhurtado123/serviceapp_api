const express = require("express");
const router = express.Router();
const Category = require('../../models/Category');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.render('categories/categories', {categories});
  } catch (e) {
    return next(e);
  }
});




module.exports = router;