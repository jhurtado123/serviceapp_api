const express = require("express");
const router = express.Router();
const Ad = require('../../models/Ad');

router.get('/', (req, res, next) => {
  const {search, maxRadius, maxPrice, category, orderBy} = req.query;
  console.log(orderBy);
  const tagsSearch = search.split(' ');
  const userCoordinates = req.session.currentUser.location.coordinates;

  const query = getQuery(tagsSearch, search, maxPrice, category, userCoordinates, maxRadius);
  const sort = getSort(orderBy);
  Ad.find({$and: query}).populate('category owner').sort(sort)
    .then(ads => {
      return res.status(200).json(ads);
    })
    .catch(error => {
      return next(error);
    });
});

function getTagsQuery(tags) {
  tags = tags.filter(tag => tag !== '');

  return tags.map(tag => {
    return {'tags': tag};
  });
}

function getSort(sortField) {
  if (sortField === 'price') return {price: 1};
  return {};
}

function getQuery(tagsSearch, search, maxPrice, category, userCoordinates, maxRadius) {
  return [
    search ? {$or: [{'name': {$regex: search, $options: 'i'}}, ...getTagsQuery(tagsSearch)]} : {},
    maxRadius ? { 'location': {
              $near: {
                $geometry: {
                  type: "Point",
                  coordinates: userCoordinates,
                },
                $maxDistance: maxRadius*1000
              } }} : {},
    maxPrice ? {'price': {$lte: maxPrice}} : {},
    category ? {'category': category} : {},
    {'deleted_at': null},
  ];
}

module.exports = router;