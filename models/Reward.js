const mongoose = require('mongoose');

const { Schema } = mongoose;

const rewardSchema = new Schema(
  {
    type: String,
    total: Number,
    points: Number,
  }
);


const Reward = mongoose.model("Reward", rewardSchema);

module.exports = Reward;