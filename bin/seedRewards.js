const mongoose = require('mongoose');
const Reward = require('../models/Reward');

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

const rewards = [
  {
    "type": "profile",
    "total": 1,
    "points": 15,
  },
  {
    "type": "ad",
    "total": 1,
    "points": 20,
  },
  {
    "type": "ad",
    "total": 5,
    "points": 125,
  },
  {
    "type": "ad",
    "total": 10,
    "points": 300,
  },
  {
    "type": "ad",
    "total": 25,
    "points": 800,
  },
  {
    "type": "ad",
    "total": 50,
    "points": 850,
  },
  {
    "type": "service",
    "total": 1,
    "points": 30,
  },
  {
    "type": "service",
    "total": 5,
    "points": 175,
  },
  {
    "type": "service",
    "total": 10,
    "points": 375,
  },
  {
    "type": "service",
    "total": 25,
    "points": 900,
  },
  {
    "type": "service",
    "total": 50,
    "points": 2000,
  },
  {
    "type": "service",
    "total": 100,
    "points": 5000,
  },
  {
    "type": "service",
    "total": 150,
    "points": 12500,
  },
  {
    "type": "service",
    "total": 500,
    "points": 70000,
  }
]


Reward.create(rewards)
  .then((savedRewards) => {
    console.log(`Created ${savedRewards.length} records`);
    mongoose.connection.close();
  })
  .catch((err) => console.log(err));
