const mongoose = require('mongoose');

const { Schema } = mongoose;

const levelSchema = new  Schema (
  {
    level: Number,
    minpoints: Number,
    maxpoints: Number,
    reward: Number,
  }
);


const Level = mongoose.model("Level", levelSchema);

module.exports = Level;