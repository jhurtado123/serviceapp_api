const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const User = require('../../models/User');
const Ad = require('../../models/Ad');
const Level = require('../../models/Level');
const { checkIfLoggedIn } =  require('../../middlewares/authMiddleware');

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "./public/uploads");
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

/* GET user */
/*with whoami */

router.get('/level', checkIfLoggedIn, async (req, res, next) => {
    const { currentUser } = req.session;
    try{
      const { points } = await User.findById(currentUser._id)
      console.log(points)
      const level = await Level.find({ "maxpoints": {$gte: points}, "minpoints": {$lte: points}})
      return res.status(200).json(level)
    }
    catch (error) {
      next(error);
    }
    
})

router.put("/edit", upload.any(), checkIfLoggedIn, async (req, res, next) => {
  const { currentUser } = req.session;
  const files = req.files;
  let { name, description, address, number, postalcode, lat, lng } = req.body;
  const images = [];
  files.forEach((file) => images.push(file.filename));

  try{
    const user = await User.findOneAndUpdate(
      { '_id': currentUser._id },
      { name, description, address, number, postalcode, location: { coordinates: [lat, lng] }, 'profile_image': images[0] }
      )
        if(user.images[0] !== ''){
          const profileDirectory = `./public/uploads/profile/${user._id}`;
          if (!fs.existsSync(profileDirectory)) {
            fs.mkdirSync(profileDirectory);
          }
          files.forEach(file => {
            try {
              fs.readdirSync(profileDirectory).forEach((file) => {
                fs.unlinkSync(`${profileDirectory}/${file}`);
              });
              fs.rename(file.path, `${profileDirectory}/${file.filename}`, function (err) {
                if (err) next();
              })
            } catch (e) {}
        })
      }
    return res.status(200).json({user: true});
  }
  catch (error) {
    next(error);
  }
});

router.get('/ads', checkIfLoggedIn, async (req, res,next) => {
  const user = req.session.currentUser;
  try {
    const ads = await Ad.find({owner: user._id, deleted_at: null}).populate('category')
        return res.status(200).json({ads});
  }
  catch (error) {
    next(error);
  }
});

router.get('/ads/removed', checkIfLoggedIn, async (req, res,next) => {
  const user = req.session.currentUser;
  try{
    const ads = await Ad.find({owner: user._id, deleted_at: { $ne: null }}).populate('category')
      return res.status(200).json({ads});
  }
  catch (error) {
    next(error);
  }
});

module.exports = router;
