const mongoose = require('mongoose');

const { Schema } = mongoose;

const adSchema = new  Schema (
  {
    owner:  {type: Schema.Types.ObjectId, ref: 'User'},
    name: {
      type: String,
      required: true,
    },
    description: String,
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
    price: Number,
    number: String,
    address: String,
    postalCode: String,
    tags: [String],
    category: {type: Schema.Types.ObjectId, ref: 'Category'},
    images : Array,
    deleted_at: {
      type: Date,
      default: null,
    }
  },
  {
    timestamps: true
	} 
);

const Ad = mongoose.model("Ad", adSchema);

module.exports = Ad;