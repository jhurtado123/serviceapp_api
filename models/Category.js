const mongoose = require('mongoose');

const { Schema } = mongoose;

const categorySchema = new  Schema (
  {
    name: String,
    default_image: String,
    deleted_at: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true
	} 
);


const Category = mongoose.model("Category", categorySchema);

module.exports = Category;