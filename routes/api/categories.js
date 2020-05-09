const express = require("express");
const router = express.Router();
const Category = require('../../models/Category');

router.get('/', async (req, res, next) => {
  try {
    const categories = await Category.find();
    return res.status(200).json({categories});
  }
  catch (e) {
    return res.status(500).json({message: 'Server error'});
  }

});

module.exports = router;