const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Chat = require('../models/Chat');
//const notification = require('./notifications');


function changeAppointmentStatusIfFinished(req, res, next) {

  if (!req.session.currentUser) return next();

  const userId = req.session.currentUser._id;
  let now = new Date();
  now = new Date(now.setHours(now.getHours()+2));
  Appointment.find({'status': 'active', $or: [{'buyer': userId, date : {$lt: now}}, {'seller': userId, date : {$lt: now}}]}).populate('buyer seller')
    .then(appointments => {
      appointments.forEach(appointment => {
        appointment.status = 'finished';
        //notification([appointment.lesser], {'title': `Tu cita con ${appointment.lessor.name} ha terminado. Dejale una valoración.`, 'href': `/review/${appointment._id}/create`});
        appointment.save();
      });
      return next();
    })
    .catch(err => next());
}

module.exports = {changeAppointmentStatusIfFinished};