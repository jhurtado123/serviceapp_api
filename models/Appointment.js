const mongoose = require('mongoose');

const { Schema } = mongoose;

const appointmentSchema = new  Schema (
  {
    pendingTokens: Number,
    date: Date,
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point',
        required: true
      },
      coordinates: [{
        type: [Number],
        required: true
      }]
    },
    seller: {type: Schema.Types.ObjectId, ref: 'User'},
    buyer: {type: Schema.Types.ObjectId, ref: 'User'},
    ad: {type: Schema.Types.ObjectId, ref: 'Ad'},
    status: {
      type: String,
      default: 'active',
    }
  },
  {
    timestamps: true
	} 
);

const Appointment = mongoose.model("Appointment", appointmentSchema);

module.exports = Appointment;