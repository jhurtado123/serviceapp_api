const express = require("express");
const router = express.Router();
const Appointment = require('../../models/Appointment');
const User = require('../../models/User');

router.get('/', async (req, res, next) => {
  try {
    const appointments = await Appointment.find().sort({createdAt: -1}).limit(10).populate('ad');
    const lastUsers = await User.find().sort({createdAt: -1}).limit(7);
    res.render('index', {appointments, lastUsers});
  } catch (e) {
    return next(e);
  }
});




module.exports = router;