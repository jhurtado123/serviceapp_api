const express = require("express");
const router = express.Router();
const Setting = require('../../models/Setting');

router.get('/', async (req, res, next) => {
  try {
    const settings = await Setting.find();
    return res.render('settings/settings', {serkensSettings: settings});
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const setting = await Setting.findOne({_id: id}, {_id:1, key:1, value:1});
    return res.status(200).json({setting});
  } catch (e) {
    return next(e);
  }
});

router.post('/:id', async (req, res, next) => {
  const {id} = req.params;
  const {value} = req.body;
  try {
    await Setting.findOneAndUpdate({_id: id}, {value});
    return res.redirect('/admin/settings');
  } catch (e) {
    return next(e);
  }
});




module.exports = router;