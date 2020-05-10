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
    default_image: 'fontaneria.png',
  },
  {
    name: 'Jardinería',
    default_image: 'jardineria.jpg',
  },
  {
    name: 'Formación',
    default_image: 'formacion.jpg',
  },
  {
    name: 'Electricidad',
    default_image: 'electricidad.jpg',
  },
  {
    name: 'Mantenimiento',
    default_image: 'matenimiento.jpeg',
  },
  {
    name: 'Motor',
    default_image: 'motor.jpg',
  },
  {
    name: 'Pintura',
    default_image: 'pintura.jpg',
  },
  {
    name: 'Fontanería',
    default_image: 'fontaneria.png',
  },
  {
    name: 'Limpieza',
    default_image: 'limpieza.jpg',
  },
  {
    name: 'Limpieza de terrenos',
    default_image: 'limpieza_de_terrenos.jpg',
  },
  {
    name: 'Montaje de muebles',
    default_image: 'montaje_de_muebles.png',
  },
  {
    name: 'Reparaciones',
    default_image: 'reparaciones.jpg',
  },
];


Category.create(categories)
  .then(savedCategories => {
    console.log(`Created ${savedCategories.length} records`);
    mongoose.connection.close();
  })
  .catch(err => console.log(err));
