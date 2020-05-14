const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new  Schema (
  {
    ad: {type: Schema.Types.ObjectId, ref: 'Ad'},
    buyer: {type: Schema.Types.ObjectId, ref: 'User'},
    seller : {type: Schema.Types.ObjectId, ref: 'User'},
    price: Number,
    hasAppointment: {
      type: Boolean,
      default: false

    },
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true
	} 
);


const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;