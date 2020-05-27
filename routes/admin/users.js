const express = require("express");
const router = express.Router();
const User = require('../../models/User');
const mapboxApiClient = require("../../services/mapbox");


router.get('/', async (req, res, next) => {
  try {
    const users = await User.find();
    return res.render('users/users', {users});
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  try {
    const {id} = req.params;
    const user = await User.findOne({_id: id}, {_id:1, name:1, role:1, description:1, address:1, city:1, number: 1, postalcode:1, wallet:1, points:1});
    return res.status(200).json({user});
  } catch (e) {
    return next(e);
  }
});

router.post('/:id', async (req, res, next) => {
  const {id} = req.params;
  const {name, description, address, number, role, city, postalcode, tokens, points} = req.body;
  try {
    let coordsForUser = [];
    const userCoordinates = await mapboxApiClient.getCoordsByDirection(address ? `${address} ${number}, ${postalcode}` : postalcode);
    coordsForUser = userCoordinates.data.features[0] ? userCoordinates.data.features[0].geometry.coordinates : [0,0] ;
    await User.findOneAndUpdate({_id: id}, {name, description, role: [role], address, number, city, postalcode, wallet: {tokens}, points, location: {geometry: 'Point', coordinates: coordsForUser}});
    return res.redirect('/admin/users');
  } catch (e) {
    return next(e);
  }
});




module.exports = router;