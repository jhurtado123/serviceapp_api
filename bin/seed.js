const mongoose = require('mongoose');
const Category = require('../models/Category');

mongoose
  .connect('mongodb+srv://root:toor@serviceapppre-v1vur.mongodb.net/serviceApp', {useNewUrlParser: true})
  .then(x => {
    console.log(`Connected to Mongo! Database name: "${x.connections[0].name}"`)
  })
  .catch(err => {
    console.error('Error connecting to mongo', err)
  });

const categories = [
  {
    name: 'Fontanería',
    default_image: '',
  },
  {
    name: 'Jardinería',
    default_image: '',
  },
  {
    name: 'Formación',
    default_image: '',
  },
  {
    name: 'Electricidad',
    default_image: '',
  },
  {
    name: 'Mantenimiento',
    default_image: '',
  },
  {
    name: 'Motor',
    default_image: '',
  },
  {
    name: 'Pintura',
    default_image: '',
  },
  {
    name: 'Fontanería',
    default_image: '',
  },
  {
    name: 'Limpieza',
    default_image: '',
  },
  {
    name: 'Limpieza de terrenos',
    default_image: '',
  },
  {
    name: 'Montaje de muebles',
    default_image: '',
  },
  {
    name: 'Reparaciones',
    default_image: '',
  },
];


Category.create(categories)
  .then(savedCategories => {
    console.log(`Created ${savedCategories.length} records`);
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
