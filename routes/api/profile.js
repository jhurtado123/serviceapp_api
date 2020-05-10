const express = require('express');
const router = express.Router();
const path = require("path");
const multer = require("multer");
const fs = require("fs");
const User = require('../../models/User');
const Ad = require('../../models/Ad');
const Level = require('../../models/Level');

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
router.get('/', (req, res, next) => {
  const { currentUser } = req.session;
  User.findById(currentUser._id)
    .then(user => {
      res.status(200).json(user)
    })
    .catch((error) => {
    return res.status(500).json({ data: 'Server error' });
    })
});

router.get('/level', async (req, res, next) => {
    const { currentUser } = req.session;
    const userpoints = await User.findById(currentUser._id)
    .then((user) => {
      return user.points;
    })
    .catch((error) => console.log(error))
    const level = await Level.find({ "maxpoints": {$gte: userpoints}, "minpoints": {$lte: userpoints}})
    .then((level) => {
      return res.status(200).json(level)
    })
    .catch((error) => {console.log(error)})
    
})

router.put("/edit", upload.any(), async (req, res, next) => {
  const { currentUser } = req.session;
  const files = req.files;
  let { name, description, address, number, postalcode, lat, lng } = req.body;
  const images = [];
  files.forEach((file) => images.push(file.filename));

  User.findOneAndUpdate(
    { '_id': currentUser._id },
    { name, description, address, number, postalcode, lat, lng, 'profile_image': images[0] }
    )
    .then((user) => {

      const profileDirectory = `./public/uploads/profile/${user._id}`;
      files.forEach((file) => {
        try {
          fs.readdirSync(profileDirectory).forEach((file) => {
            fs.unlinkSync(`${profileDirectory}/${file}`);
          });
        } catch (e) {}
        fs.rename(file.path, `${profileDirectory}/${file.filename}`, function (err) {
          if (err) next();
        })
      });
      return res.status(200).json({data: true});
    })
    .catch((error) => {
      return next();
    });
  });

router.get('/ads', (req, res,next) => {
  const user = req.session.currentUser;
  if (!user) {
    next();
  }

  Ad.find({owner: user._id, deleted_at: null})
    .then(ads => {
      return res.status(200).json({ads});
    })
    .catch(error => {
      next(error);
    })

});

router.get('/ads/removed', (req, res,next) => {
  const user = req.session.currentUser;
  if (!user) {
    next();
  }

  Ad.find({owner: user._id, deleted_at: { $ne: null }})
    .then(ads => {
      return res.status(200).json({ads});
    })
    .catch(error => {
      next(error);
    })

});

module.exports = router;
