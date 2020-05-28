const express = require("express");
const router = express.Router();
const Setting = require('../../models/Setting');

router.get('/:key', async (req, res, next) => {
  const {key} = req.params;
  try {
    const settingValue = await Setting.findOne({key}, {value:1});
    return res.status(200).json({settingValue});
  } catch (e) {
    return next(e);
  }
});

module.exports = router;