const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new  Schema (
  {
    username: { type: String, required: true, unique: true},
    password: {type: String, required: true },
    name: { type: String },
    role: [],
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
    profile_image: String,
    description: String,
    points: { type: Number, default: 0},
    address: String,
    number: Number,
    postalcode: String,
    city: String,
    wallet: {
      tokens: { type: Number, default: 0 },
    },
    review:  [{
      user: { type: Schema.Types.ObjectId, ref: 'User' },
      ad: { type: Schema.Types.ObjectId, ref: 'Ad' },
      content:  String,
      rating: Number,
    }],
    recently_viewed: [],
    favorites: [{ type: Schema.Types.ObjectId, ref: 'Ad' }],
  },
  {
		timestamps: {
			createdAt: 'created_at',
			updatedAt: 'updated_at',
		},
	} 
);


const User = mongoose.model("User", userSchema);

module.exports = User;