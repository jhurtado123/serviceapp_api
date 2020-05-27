const mongoose = require('mongoose');
const Setting = require('../models/Setting');

mongoose
  .connect('mongodb+srv://root:toor@serviceapppre-v1vur.mongodb.net/serviceApp', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const settings = [
  {
    key: 'serkens_price_euros',
    value: '0.003',
  },

];


Setting.create(settings)
  .then(savedSettings => {
    console.log(`Created ${savedSettings.length} records`);
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
