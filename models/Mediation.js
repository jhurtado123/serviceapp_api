const mongoose = require('mongoose');

const { Schema } = mongoose;

const mediationSchema = new  Schema (
  {
   status: {
     type: String,
     default: 'in-process',
   },
    appointment: {type: Schema.Types.ObjectId, ref: 'Appointment'},
    buyerMessage: String,
  },
  {
    timestamps: true
	} 
);

const Mediation = mongoose.model("Mediation", mediationSchema);

module.exports = Mediation;