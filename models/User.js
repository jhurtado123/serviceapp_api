const mongoose = require('mongoose');

const { Schema } = mongoose;

const userSchema = new  Schema (
  {
    username: { type: String, required: true, unique: true},
    password: {type: String, required: true },
    name: { type: String },
    role: [],
    profile_image: String,
    description: String,
    points: { type: Number, default: 0},
    address: String,
    postalcode: String,
    city: String,
    wallet: {
      tokens: Number,
    },
    review:  {
      content:  String,
      rating: Number,
    }
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