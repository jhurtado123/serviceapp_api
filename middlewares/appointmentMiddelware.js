const mongoose = require('mongoose');
const User = require('../models/User');
const Appointment = require('../models/Appointment');
const Chat = require('../models/Chat');
//const notification = require('./notifications');


function changeAppointmentStatusIfFinished(req, res, next) {
  return next();
  const userId = req.session.currentUser._id;
  const now = new Date();
  Appointment.find({'status': 'Activa', $or: [{'lesser': userId, date : {$lt: now}}, {'lessor': userId, date : {$lt: now}}]}).populate('lesser lessor')
    .then(appointments => {
      appointments.forEach(appointment => {
        appointment.status = 'Finalizada';
        notification([appointment.lesser], {'title': `Tu cita con ${appointment.lessor.name} ha terminado. Dejale una valoración.`, 'href': `/review/${appointment._id}/create`});
        appointment.save();
        Chat.findOne({ _id: appointment.chat._id })
          .then(resultChat => {
          resultChat.hasAppointment = false;
          resultChat.save();
        });
      });
      return next();
    })
    .catch(err => next());
}

module.exports = {changeAppointmentStatusIfFinished};