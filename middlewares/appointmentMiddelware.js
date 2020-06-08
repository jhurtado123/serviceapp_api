const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Chat = require('../models/Chat');
const notificationsSend = require('../middlewares/notificationMiddleware');



async function changeAppointmentStatusIfFinished(req, res, next) {

  if (!req.session.currentUser) return next();

  const userId = req.session.currentUser._id;
  let now = new Date();
  now = new Date(now.setHours(now.getHours()+2));
  await Appointment.findOneAndUpdate({'status': 'active', $or: [{'buyer': userId, date : {$lt: now}}, {'seller': userId, date : {$lt: now}}]}, {status: 'finished'}).populate('buyer seller')
    .then(async appointment => {
        await notificationsSend(appointment.seller._id, { title: 'Servicio finalizado', href: appointment._id, type: 'appointment-finished' });
        await notificationsSend(appointment.buyer._id, { title: 'Servicio finalizado', href: appointment._id, type: 'appointment-finished' });
      return next();
    })
    .catch(err => next());
}

module.exports = {changeAppointmentStatusIfFinished};