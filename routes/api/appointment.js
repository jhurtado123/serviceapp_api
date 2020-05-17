const express = require("express");
const router = express.Router();
const autMiddleware = require('../../middlewares/authMiddleware');
const Appointment = require('../../models/Appointment');


router.get('/:id', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const {id} = req.params;
  try {
    const appointment =  await Appointment.find({_id: id, status: 'active', $or: [{seller: currentUser}, {buyer: currentUser}]}).populate('ad seller buyer');
    return res.status(200).json({appointment});
  } catch (e) {
    return next(e);
  }
});

router.get('/', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  try {
    const appointments = await Appointment.find({status: 'active', $or: [{seller: currentUser}, {buyer: currentUser}]}).sort({date: 1}).populate('ad seller buyer');
    return res.status(200).json({appointments});
  } catch (e) {
    return next(e);
  }
});

module.exports = router;