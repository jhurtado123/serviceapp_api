const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");
const axios = require("axios");

const { checkUsernameAndPasswordNotEmpty } = require('../../middlewares/authMiddleware');
const mapboxApiClient = require("../../services/mapbox");

const User = require("../../models/User");

router.get('/whoami', (req, res, next) => {
  if (req.session.currentUser) {
    res.status(200).json(req.session.currentUser)
  } else {
    res.status(401).json({data: 'not-authorized'})
  }
});

router.post('/signup', checkUsernameAndPasswordNotEmpty, async (req, res, next) => {
  const { username, password, name, postalcode } = req.body;
  let coordsForUser ='';
  let userCity = '';

  try {
    const user = await User.findOne({ username});
    if (user) {
      return res.status(422).json({ data: 'El nombre de usuario ya existe' })
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);

    const userCoordinates = await mapboxApiClient.getCoordsByPostalCode(postalcode)
    coordsForUser = userCoordinates.data.features[0].geometry.coordinates;

    const cityPostalCode = await mapboxApiClient.getCity(postalcode)
    userCity = cityPostalCode.data.features[0].context[0].text

    const newUser = await User.create({
      username,
      password: hash,
      name,
      location: { coordinates: coordsForUser},
      postalcode,
      city: userCity,
      });
    req.session.currentUser = newUser;
    return res.status(200).json(newUser);
  }
  catch (error) {
    return res.status(500).json({ data: 'Server error' });
  }
});

router.post('/doesUsernameExist', async (req, res, next) => {
  const {username} = req.body;
  try {
    const user = await User.findOne({username});
    if (user) {
      return res.status(200).json({data: true});
    } else {
      return res.status(200).json({data: false});
    }
  } catch (e) {
    return res.status(500).json({data: 'Server error'});
  }
});

router.post('/login', checkUsernameAndPasswordNotEmpty, async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({username});
    if (!user) {
      return res.status(404).json({data: 'Nombre de usuario o contraseña incorrectos.'});
    }
    if (bcrypt.compareSync(password, user.password)) {

      req.session.currentUser = user;
      return res.status(200).json(user);
    } else {
      return res.status(404).json({data: 'Nombre de usuario o contraseña incorrectos.'});
    }
  } catch (error) {
    return res.status(500).json({data: "Server error"});
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(error => {
    if (error) {
      next(error)
    }
    return res.status(204).send()
  })
});


module.exports = router;