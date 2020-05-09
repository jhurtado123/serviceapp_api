const express = require("express");
const router = express.Router();
const path = require('path');
const multer  = require('multer');
const Ad = require('../../models/Ad');
const fs = require('fs');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, './public/uploads')
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname))
  }
});
const upload = multer({storage: storage});

router.get('/:id', async (req, res, next) => {
    const {id} = req.params;
    try {
       const ad =  await Ad.findOne({_id: id})
       return res.status(200).json({ad});
    } catch {
        next();
    }
});

router.post('/', upload.any(), (req, res, next) => {
  const files = req.files;
  let {name, description, price, number, address, postalCode, category, lat, lng, tags} = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({data: 'Rellena los campos obligatorios antes de continuar.'});
  }
  tags = tags.split(',');

  const images = [];
  files.forEach(file => images.push(file.filename));

  const owner = req.session.currentUser;

  Ad.create({name, owner: owner._id, description, price, category, tags, number, address, postalCode, location: {coordinates: [lat, lng] }, images})
    .then(ad => {

          const adDirectory = `./public/uploads/adImages/${ad._id}`;
          if (!fs.existsSync(adDirectory)){
                 fs.mkdirSync(adDirectory);
              }
           files.forEach(file => {
                fs.rename(file.path, `${adDirectory}/${file.filename}`, function (err) {
                  if (err) next();
                })
           });

      return res.status(200).json({data: true});
    })
    .catch(error => {
      next();
    })
});

router.put('/:id', upload.any(), (req, res, next) => {
  const {id} = req.params;
  const files = req.files;
  let {name, description, price, number, address, postalCode, category, lat, lng, tags} = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({data: 'Rellena los campos obligatorios antes de continuar.'});
  }
  tags = tags.split(',');

  const images = [];
  files.forEach(file => images.push(file.filename));

  const owner = req.session.currentUser;

  Ad.findOneAndUpdate({'_id': id}, {name, owner: owner._id, description, price, category, tags, number, address, postalCode, location: {coordinates: [lat, lng] }, images})
    .then(ad => {

          const adDirectory = `./public/uploads/adImages/${ad._id}`;
           files.forEach(file => {
                try {
                    fs.readdirSync(adDirectory).forEach(file => {
                      fs.unlinkSync(`${adDirectory}/${file}`);
                    });
                } catch (e) {}
                fs.rename(file.path, `${adDirectory}/${file.filename}`, function (err) {
                  if (err) next();
                })
           });

      return res.status(200).json({data: true});
    })
    .catch(error => {
      next();
    })
});

module.exports = router;