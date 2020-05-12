const mongoose = require('mongoose');
const Category = require('../models/Category');
const Ad = require('../models/Ad');

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


/**Category.create(categories)
  .then(savedCategories => {
    console.log(`Created ${savedCategories.length} records`);
    mongoose.connection.close();
  })
  .catch(err => console.log(err)); **/


const ads = [
  {"location":{"type":"Point","coordinates":[2.07,41.38]},"tags":["tuberías"," arreglo"," tubos"," agua"],"images":[],"deleted_at":null,"name":"Arreglo tuberías","owner":"5eb707f075c1f176e484ea70","description":"Arreglo tuberías de tu casa","price":120,"category":"5eb81b73af4f7c13214ebfad","number":"","address":"","postalCode":""},
  {"location":{"type":"Point","coordinates":[2.162919,41.40302]},"tags":["podar","arboles","jardin"],"images":[],"deleted_at":null,"name":"Poda de arboles","owner":"5eb707f075c1f176e484ea70","description":"Te podo los arboles dde tu jardín","price":100,"category":"5eb81b73af4f7c13214ebfae","number":"228","address":"carrer bailen","postalCode":"08037"},
  {"location":{"type":"Point","coordinates":[2.218722,41.542094]},"tags":["formacion"," clases","ingles"],"images":[],"deleted_at":null,"name":"Clases de ingles","owner":"5eb707f075c1f176e484ea70","description":"Clases de ingles para que aprendas a hablar ingles","price":200,"category":"5eb81b73af4f7c13214ebfaf","number":"22","address":"carre","postalCode":"08120"},
  {"location":{"type":"Point","coordinates":[2.17,41.38]},"tags":["motor"," vehiculos","arreglo","mecanica"],"images":[],"deleted_at":null,"name":"Arreglo de motores","owner":"5eb707f075c1f176e484ea70","description":"Arreglo del motro de tus vehiculos ","price":300,"category":"5eb81b73af4f7c13214ebfb2","number":"","address":"paralel","postalCode":"08001"},
  {"location":{"type":"Point","coordinates":[2.17,41.63]},"tags":["mantenimiento"," instalaciones"],"images":[],"deleted_at":null,"name":"Matenimiento de instalaciones","owner":"5eb707f075c1f176e484ea70","description":"Matenimiento de instalaciones Matenimiento de instalaciones Matenimiento de instalaciones","price":400,"category":"5eb81b73af4f7c13214ebfb1","number":"33","address":"carre","postalCode":"08140"},
  {"location":{"type":"Point","coordinates":[1.62,41.58]},"tags":["electricidad"],"images":[],"deleted_at":null,"name":"Instalacion electrica","owner":"5eb707f075c1f176e484ea70","description":"Instalaciones de electricas","price":450,"category":"5eb81b73af4f7c13214ebfb0","number":"08","address":"avinguda","postalCode":"08700"},
  {"location":{"type":"Point","coordinates":[1.55,41.27]},"tags":["pinto","parendes"],"images":[],"deleted_at":null,"name":"Pintar paredes","owner":"5eb707f075c1f176e484ea70","description":"Pinto paredes","price":200,"category":"5eb81b73af4f7c13214ebfb3","number":"12","address":"carre","postalCode":"43715"},
  {"location":{"type":"Point","coordinates":[4.2986393,39.8350406]},"tags":["almacenes","limpieza"],"images":[],"deleted_at":null,"name":"Limpieza de almacenes","owner":"5eb707f075c1f176e484ea70","description":"Limpio almacenes","price":600,"category":"5eb81b73af4f7c13214ebfb5","number":"1","address":"avinguda","postalCode":"07800"},
  {"location":{"type":"Point","coordinates":[-3.765781,39.987599]},"tags":["limpieza"," terrenos"],"images":[],"deleted_at":null,"name":"Limpio terrenos","owner":"5eb707f075c1f176e484ea70","description":"Limpio terrenos","price":700,"category":"5eb81b73af4f7c13214ebfb6","number":"2","address":"carrer","postalCode":"08800"},
  {"location":{"type":"Point","coordinates":[2.07,41.37]},"tags":["electrodomesticos"],"images":[],"deleted_at":null,"name":"Reparacion de electrodomesticos","owner":"5eb707f075c1f176e484ea70","description":"Reparacion de electrodomesticos","price":230,"category":"5eb81b73af4f7c13214ebfb8","number":"22","address":"avinguda","postalCode":"08970"},
  {"location":{"type":"Point","coordinates":[2.175485,41.391689]},"tags":["montar","muebles","ikea"],"images":[],"deleted_at":null,"name":"Monto muebles de ikea","owner":"5eb707f075c1f176e484ea70","description":"Monto muebles de ikea","price":100,"category":"5eb81b73af4f7c13214ebfb7","number":"2","address":"avingud","postalCode":"08010"}
  ];

Ad.create(ads)
  .then(savedAds => {
    console.log(`Created ${savedAds.length} records`);
    mongoose.connection.close();
  })
  .catch(err => console.log(err));