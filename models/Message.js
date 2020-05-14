const mongoose = require('mongoose');

const { Schema } = mongoose;

const chatSchema = new  Schema (
  {
    chat: {type: Schema.Types.ObjectId, ref: 'Chat'},
    sender: {type: Schema.Types.ObjectId, ref: 'User'},
    isReaded : {
      type: Boolean,
      default: false,
    },
    content: String,
    type: String,
  },
  {
    timestamps: true
	} 
);


const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;