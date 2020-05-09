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

router.get('/:id/images', async (req, res, next) => {
    const {id} = req.params;
    const adDirectory = `./public/uploads/adImages/${id}`;
    fs.readdir(adDirectory, function (err, files) {
        if (err) {
            return console.log('Unable to scan directory: ' + err);
        }
        files.forEach(function (file) {
            console.log(file);
        });
    });
    try {
       const ad =  await Ad.findOne({_id: id})
       return res.status(200).json({ad});
    } catch {
        next();
    }
});

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
  let {name, description, price, number, address, postalCode, category, images, lat, lng, tags} = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({data: 'Rellena los campos obligatorios antes de continuar.'});
  }
  tags = tags.split(',');
  const owner = req.session.currentUser;

  Ad.create({name, owner: owner._id, description, price, category, tags, number, address, postalCode, location: {coordinates: [lat, lng] }})
    .then(ad => {
          const files = req.files;
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
      console.log(error);
      next();
    })
});

module.exports = router;