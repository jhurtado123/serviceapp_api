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

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const level = await Level.findOne({_id: id}, {_id:1, level:1, minpoints:1, maxpoints:1});
    return res.status(200).json({level});
  } catch (e) {
    return next(e);
  }
});

router.post('/create', async (req, res, next) => {
  const {level, minpoints, maxpoints} = req.body;
  try {
    const anyLevel = await Level.findOne({level});
    if (anyLevel) return res.redirect('/admin/levels');

    await new Level({level, maxpoints, minpoints}).save();
    return res.redirect('/admin/levels');
  } catch (e) {
    return next(e);
  }
});

router.post('/:id', async (req, res, next) => {
  const {id} = req.params;
  const { maxpoints, minpoints} = req.body;
  try {
    await Level.findOneAndUpdate({_id: id}, {minpoints, maxpoints});
    return res.redirect('/admin/levels');
  } catch (e) {
    return next(e);
  }
});

router.post('/:id/remove', async (req, res, next) => {
  const {id} = req.params;
  try {
    await Level.findOneAndRemove({_id: id});
    return res.redirect('/admin/levels');
  } catch (e) {
    return next(e);
  }
});




module.exports = router;