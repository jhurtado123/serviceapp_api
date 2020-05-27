const mongoose = require('mongoose');
const Level = require('../models/Level');

mongoose
  .connect('mongodb+srv://root:toor@serviceapppre-v1vur.mongodb.net/serviceApp', { useNewUrlParser: true })
  .then((x) => {
    console.log(
      `Connected to Mongo! Database name: "${x.connections[0].name}"`
    );
  })
  .catch((err) => {
    console.error("Error connecting to mongo", err);
  });

const levels = [
  {
    "level" : 1,
    "minpoints": 0,
    "maxpoints": 50,
  },
  {
    "level" : 2,
    "minpoints": 51,
    "maxpoints": 150,
  },
  {
    "level" : 3,
    "minpoints": 151,
    "maxpoints": 300,
  },
  {
    "level" : 4,
    "minpoints": 301,
    "maxpoints": 500,
  },
  {
    "level" : 5,
    "minpoints": 501,
    "maxpoints": 1500,
  },
  {
    "level" : 6,
    "minpoints": 1501,
    "maxpoints": 5000,
  },
  {
    "level" : 7,
    "minpoints": 5001,
    "maxpoints": 25000,
  },
  {
    "level" : 8,
    "minpoints": 25001,
    "maxpoints": 100000,
  },
]


  Level.create(levels)
    .then((savedLevels) => {
      console.log(`Created ${savedLevels.length} records`);
      mongoose.connection.close();
    })
    .catch((err) => console.log(err));
