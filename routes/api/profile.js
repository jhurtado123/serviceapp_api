const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const User = require('../../models/User');
const Ad = require('../../models/Ad');
const Level = require('../../models/Level');
const Reward = require('../../models/Reward');
const {checkIfLoggedIn} = require('../../middlewares/authMiddleware');
const {checkProfileCompletedReward} = require('../../middlewares/rewardsMiddleware');


const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({storage: storage});

/* GET user */
/*with whoami */

router.get('/level', checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  try {
    const {points} = await User.findById(currentUser._id)
    const level = await Level.find({"maxpoints": {$gte: points}, "minpoints": {$lte: points}})
    return res.status(200).json(level)
  } catch (error) {
    next(error);
  }
})

router.put("/edit", upload.any(), checkIfLoggedIn, async (req, res, next) => {
  const {currentUser} = req.session;
  const files = req.files;
  let {name, description, address, number, postalcode, lat, lng} = req.body;
  const images = [];
  let profile_image = ''
  files.forEach((file) => {
    images.push(file.filename);
    profile_image = file.filename
  });
  checkProfileCompletedReward(currentUser._id, {name, description, address})
  try {
    const newUser = await User.findOneAndUpdate(
      {'_id': currentUser._id},
      {name, description, address, number, postalcode, profile_image, location: {coordinates: [lat, lng]}}
    );
    const profileDirectory = `./public/uploads/profile/${newUser._id}`;
    if (!fs.existsSync(profileDirectory)) {
      fs.mkdirSync(profileDirectory);
    }
    await files.forEach(file => {
      try {
        fs.readdirSync(profileDirectory).forEach((file) => {
          fs.unlinkSync(`${profileDirectory}/${file}`);
        });
        fs.renameSync(file.path, `${profileDirectory}/${file.filename}`, function (err) {
          if (err) next();
        })
      } catch (e) {
      }
    });
    console.log(newUser);
    return res.status(200).json({image: profile_image});
  } catch (error) {
    next(error);
  }
});

router.get('/ads', checkIfLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const ads = await Ad.find({owner: user._id, deleted_at: null}).populate('category')
    return res.status(200).json({ads});
  } catch (error) {
    next(error);
  }
});

router.get('/user/:username', async (req, res, nex) => {
  const {username} = req.params;
  try {
    const user = await User.find({username})
    return res.status(200).json({user})
  } catch (error) {
    next(error);
  }
})

router.get('/ads/removed', checkIfLoggedIn, async (req, res, next) => {
  const user = req.session.currentUser;
  try {
    const ads = await Ad.find({owner: user._id, deleted_at: {$ne: null}}).populate('category');
    return res.status(200).json({ads});
  } catch (error) {
    next(error);
  }
});


router.put('/ad/:id', checkIfLoggedIn, async (req, res, next) => {
  const {id} = req.params;
  const user = req.session.currentUser;
  try {
    const ad = await Ad.findOne({_id: id}).populate('category');
    const {recently_viewed} = await User.findOne({'_id': user._id});
    if (recently_viewed.length > 6) {
      recently_viewed.pop()
    }
    recently_viewed.unshift(ad);
    const userUpdated = await User.findOneAndUpdate(
      {'_id': user._id},
      {recently_viewed: recently_viewed}
    );
    return res.status(200).json({userUpdated});
  } catch (error) {
    next(error);
  }
});

router.put('/buyTokens', async (req, res, next) => {
  const {quantity} = req.body;
  const {currentUser} = req.session;
  try {
    await User.findOneAndUpdate({ _id: currentUser._id }, { $inc: { 'wallet.tokens': quantity } });
    return res.status(200).json({response: true});
  } catch (e) {
    return next(e)
  }
  
});


router.put('/notifications/', checkIfLoggedIn, async (req, res, next) => {
  const { currentUser } = req.session;
  try {
    const { notifications } = await User.findById({_id: currentUser._id})
    for (let i = 0; i < notifications.length; i++) {
      const notification = notifications[i];
      notification.isReaded = true; 
      
    }
    await User.findOneAndUpdate({_id: currentUser._id}, {notifications})
    return res.status(200).json({ response: true });
  } catch(e){
    return next(e)
  }
});

router.get('/rewards/ads', checkIfLoggedIn, async (req, res, next) => {
  const { currentUser } = req.session;
  try {
    const ads = await Ad.find({ owner: currentUser._id, deleted_at: null })
    let numAds = ads.length; 
    const reward = await Reward.find({"type": "ad", "total": { $gte: numAds}})
    return res.status(200).json(reward[0])
  } catch (error) {
    next(error);
  }
})


module.exports = router;
