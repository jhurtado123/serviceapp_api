const mongoose = require('mongoose');

const { Schema } = mongoose;

const settingSchema = new  Schema (
  {
    key: String,
    value: String,
  }
);


const Setting = mongoose.model("Setting", settingSchema);

module.exports = Setting;