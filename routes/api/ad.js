const express = require("express");
const router = express.Router();
const path = require('path');
const multer  = require('multer');
const Ad = require('../../models/Ad');
const User = require('../../models/User');
const autMiddleware = require('../../middlewares/authMiddleware');
const adMiddleware = require('../../middlewares/adMiddleware');
const {checkAdsReward} = require('../../middlewares/rewardsMiddleware');

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
      const ad =  await Ad.findOne({_id: id}).populate('owner category')
      return res.status(200).json({ad});
    } catch {
        next();
    }
});

router.get('/:id/data', adMiddleware.isOwner, async (req, res, next) => {
    const {id} = req.params;
    try {
      const ad =  await Ad.findOne({_id: id});
      return res.status(200).json({ad});
    } catch {
        next();
    }
});

router.get('/:id/withRelated', async (req, res, next) => {
    const {id} = req.params;
    try {
      const ad =  await Ad.findOne({_id: id, deleted_at: null}).populate('owner category');
      const relatedAds = await Ad.find({_id : {$ne: ad._id}, category: ad.category._id, deleted_at: null}).populate('category').limit(5);
      return res.status(200).json({ad, relatedAds});
    } catch {
        next();
    }
});

router.delete('/:id', autMiddleware.checkIfLoggedIn, adMiddleware.isOwner, async (req, res, next) => {
    const {id} = req.params;
    try {
      const ad =  await Ad.findOneAndUpdate({_id: id}, {deleted_at: new Date()})
      return res.status(200).json(ad);
    } catch(error) {
        next(error);
    }
});

router.put('/:id/recover', autMiddleware.checkIfLoggedIn, adMiddleware.isOwner, async (req, res, next) => {
    const {id} = req.params;
  try {
      const ad =  await Ad.findOneAndUpdate({_id: id}, {deleted_at: null})
      return res.status(200).json(ad);
    } catch(error) {
        next(error);
    }
});

router.post('/', autMiddleware.checkIfLoggedIn, upload.any(), async (req, res, next) => {
  const files = req.files;
  let {name, description, price, number, address, postalCode, category, lat, lng, tags} = req.body;

  if (!name || !price || !category) {
    return res.status(400).json({data: 'Rellena los campos obligatorios antes de continuar.'});
  }
  tags = tags.split(',');

  const images = [];
  files.forEach(file => images.push(file.filename));

  const owner = req.session.currentUser;
  try{
    const ad = await Ad.create({name, owner: owner._id, description, price, category, tags, number, address, postalCode, location: {coordinates: [lat, lng] }, images})
    const adDirectory = `./public/uploads/adImages/${ad._id}`;
    if (!fs.existsSync(adDirectory)){
            fs.mkdirSync(adDirectory);
        }
      files.forEach(file => {
          fs.rename(file.path, `${adDirectory}/${file.filename}`, function (err) {
            if (err) next();
          })
      });
      checkAdsReward(owner._id)
        return res.status(200).json({data: true});
  }
  catch (error) {
    next(error);
  }
});

router.put('/:id', autMiddleware.checkIfLoggedIn,  adMiddleware.isOwner,  upload.any(), async (req, res, next) => {
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
  try {
    const ad = await Ad.findOneAndUpdate({'_id': id}, {name, owner: owner._id, description, price, category, tags, number, address, postalCode, location: {type: 'Point', coordinates: [lat, lng] }})
    const adDirectory = `./public/uploads/adImages/${ad._id}`;
      try {
          fs.readdir(adDirectory, (err, files) => {
            if (err) return next(err);
            for (const fileIn of files) {
              fs.unlink(`${adDirectory}/${fileIn}`, err => {
                if (err) return next(err);
              });
            }
          });
        } catch (e) {
            return next()
        }
        ad.images = [];
        files.forEach(file => {
              fs.rename(file.path, `${adDirectory}/${file.filename}`, function (err) {
                if (err)  return next(err);
              });
              ad.images.push(file.filename);
        });
    await ad.save();

    return res.status(200).json({ad: true});
  }
  catch (error) {
    return next(error);
  }
});

router.get('/user', async (req, res, next) => {
  const { currentUser } = req.session;
  try{
    const ads = await Ad.find({"owner": currentUser._id}).populate("owner category");
      return res.status(200).json(ads);
  }
  catch (error) {
    next(error);
  }
});

router.get('/user/:id', async (req, res, next) => {
  console.log(req.params)
  const { id } = req.params;
  try{
    const ads = await Ad.find({ owner: id }).populate("owner category");
    return res.status(200).json(ads);
  }
  catch (error) {
    next(error);
  }
const ad = await Ad.findOne({ _id: id, deleted_at: null })
});

router.get('/getallads', async (req, res, next) => {
  try {
    const ads = await Ad.aggregate([
      {
        $lookup: {
          from: 'categories',
          localField: 'category',
          foreignField: '_id',
          as: 'string'
        }
      },
      {
        $group: { 
          _id: "$string",
          "category": { $sum: 1 },
          count: { $sum: 1 },
        }
      },
      {
        $sort : {count: -1}
      }
    ])
    return res.status(200).json(ads)
  }
  catch (error) {
    next(error);
  }
})


module.exports = router;