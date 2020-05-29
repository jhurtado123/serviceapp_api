const express = require("express");
const router = express.Router();
const Mediation = require('../../models/Mediation');
const Appointment = require('../../models/Appointment');
const User = require('../../models/User');
const createNofifications = require ('../../middlewares/notificationMiddleware');

router.get('/', async (req, res, next) => {
  try {
    const mediations = await Mediation.find({status: 'in-process'})
      .populate({
        path: 'appointment',
        populate : {
          path : 'ad buyer seller'
        },
        model: 'Appointment'
      });

    return res.render('mediations/mediations', {mediations});
  } catch (e) {
    return next(e);
  }
});

router.post('/:id/resolve', async (req, res, next) => {
  const {id} = req.params;
  const {serkensForSeller} = req.body;
  try {
    const mediation = await Mediation.findOne({_id: id});
    const appointment = await Appointment.findOne({_id: mediation.appointment});
    const buyer = await User.findOne({_id: appointment.buyer});
    const seller = await User.findOne({_id: appointment.seller});

    buyer.wallet.tokens += parseInt(appointment.pendingTokens) - parseInt(serkensForSeller);
    seller.wallet.tokens += parseInt(serkensForSeller);
    await buyer.save();
    await  seller.save();

    mediation.status = 'solved';
    await mediation.save();

    appointment.pendingTokens = 0;
    await appointment.save();

    createNofifications(buyer._id,{'title': 'Se ha resuelto la mediación', 'href': `#`, 'type': 'mediation-resolve'});
    createNofifications(seller._id,{'title': 'Se ha resuelto la mediación', 'href': `#`, 'type': 'mediation-resolve'});

    return res.redirect('/admin/mediations');
  } catch (e) {
    return next(e);
  }
});

router.get('/:id', async (req, res, next) => {
  const {id} = req.params;
  try {
    const mediation = await Mediation.findOne({_id: id, status: 'in-process'})
      .populate({
        path: 'appointment',
        populate : {
          path : 'ad buyer seller'
        },
        model: 'Appointment'
      });

    return res.status(200).json({mediation});
  } catch (e) {
    return next(e);
  }
});


module.exports = router;