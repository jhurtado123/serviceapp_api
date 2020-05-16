const mongoose = require('mongoose');

const { Schema } = mongoose;

const messagetSchema = new  Schema (
  {
    chat: {type: Schema.Types.ObjectId, ref: 'Chat'},
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    isReaded : {
      type: Boolean,
      default: false,
    },
    data: {
      content: String,
      status: Boolean,
    },
    type: String,
  },
  {
    timestamps: true
	} 
);


const Message = mongoose.model("Message", messagetSchema);

module.exports = Message;