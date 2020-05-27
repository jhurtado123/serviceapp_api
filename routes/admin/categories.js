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

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const category = await Category.findOne({_id: id}, {_id:1, name:1, deleted_at:1});
    return res.status(200).json({category});
  } catch (e) {
    return next(e);
  }
});

router.post('/create', async (req, res, next) => {
  const {name} = req.body;
  try {
    await new Category({name}).save();
    return res.redirect('/admin/categories');
  } catch (e) {
    return next(e);
  }
});

router.post('/:id', async (req, res, next) => {
  const {id} = req.params;
  const { name, deleted_at} = req.body;
  try {
    let deleted = deleted_at === 0 ? null : new Date();
    await Category.findOneAndUpdate({_id: id}, {name, deleted_at: deleted});
    return res.redirect('/admin/categories');
  } catch (e) {
    return next(e);
  }
});

router.post('/:id/remove', async (req, res, next) => {
  const {id} = req.params;
  try {
    await Category.findOneAndUpdate({_id: id}, {deleted_at: new Date()});
    return res.redirect('/admin/categories');
  } catch (e) {
    return next(e);
  }
});

router.post('/:id/recover', async (req, res, next) => {
  const {id} = req.params;
  try {
    await Category.findOneAndUpdate({_id: id}, {deleted_at: null});
    return res.redirect('/admin/categories');
  } catch (e) {
    return next(e);
  }
});





module.exports = router;