const express = require("express");
const router = express.Router();
const Ad = require('../../models/Ad');
const Category = require('../../models/Category');
const User = require('../../models/User');
const mapboxApiClient = require("../../services/mapbox");


router.get('/', async (req, res, next) => {
  try {
    const ads = await Ad.find().populate('owner category');
    const categories = await Category.find();
    const users = await User.find();

    return res.render('ads/ads', {ads, categories, users});
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const ad = await Ad.findOne({_id: id}, {_id:1, name:1, owner:1, description:1, address:1,  number: 1, postalCode:1, price:1, deleted_at:1, category:1});
    return res.status(200).json({ad});
  } catch (e) {
    return next(e);
  }
});

router.post('/:id', async (req, res, next) => {
  const {id} = req.params;
  const {owner, name, description, address, number, postalCode, price, category, deleted_at} = req.body;
  try {
    let coordsForAd = [];
    const mapCoordinates = await mapboxApiClient.getCoordsByDirection(address ? `${address} ${number}, ${postalCode}` : postalCode);
    coordsForAd = mapCoordinates.data.features[0] ? mapCoordinates.data.features[0].geometry.coordinates : [0,0];
    let deleted = deleted_at === 0 ? null : new Date();
    await Ad.findOneAndUpdate({_id: id}, {name, description, owner, address, number, postalCode, price, category, location: {type: 'Point', coordinates: coordsForAd}, deleted_at: deleted});
    return res.redirect('/admin/ads');
  } catch (e) {
    return next(e);
  }
});

router.post('/:id/remove', async (req, res, next) => {
  const {id} = req.params;
  try {
    await Ad.findOneAndUpdate({_id: id}, {deleted_at: new Date()});
    return res.redirect('/admin/ads');
  } catch (e) {
    return next(e);
  }
});

router.post('/:id/recover', async (req, res, next) => {
  const {id} = req.params;
  try {
    await Ad.findOneAndUpdate({_id: id}, {deleted_at: null});
    return res.redirect('/admin/ads');
  } catch (e) {
    return next(e);
  }
});




module.exports = router;