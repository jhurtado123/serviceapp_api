const express = require("express");
const router = express.Router();
const autMiddleware = require('../../middlewares/authMiddleware');
const Appointment = require('../../models/Appointment');
const User = require('../../models/User');


router.get('/:id', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const {id} = req.params;
  try {
    const appointment =  await Appointment.findOne({_id: id, status: 'active', $or: [{seller: currentUser}, {buyer: currentUser}]}).populate('ad seller buyer chat');
    return res.status(200).json({appointment});
  } catch (e) {
    return next(e);
  }
});

router.delete('/:id', autMiddleware.checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const {id} = req.params;
  try {
    const appointment =  await Appointment.findOneAndUpdate({_id: id, status: 'active', $or: [{seller: currentUser}, {buyer: currentUser}]}, {status: 'canceled'});
    await User.findOneAndUpdate({_id: appointment.buyer}, {$inc : {'wallet.tokens':  appointment.pendingTokens }});
    return res.status(200).json({data: true});
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