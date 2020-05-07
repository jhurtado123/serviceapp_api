const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const { checkUsernameAndPasswordNotEmpty } = require('../../middlewares');

const User = require("../../models/User");

router.get('/whoami', (req, res, next) => {
  if(req.session.currentUser) {
    res.status(200).json(req.session.currentUser)
  } else {
    res.status(401).json({data:'not-authorized'})
  }
});

router.post('/signup', checkUsernameAndPasswordNotEmpty, async (req, res, next) => {
  const { username, password, name, postalcode } = req.body;
  try {
    const user = await User.findOne({ username});
    if (user) {
      return res.status(422).json({ data: 'El nombre de usuario ya existe' })
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    const newUser = await User.create({
      username,
      password: hash,
      name,
      postalcode,
    });
    return res.status(200).json(newUser);
    return res.json(newUser);
  } catch (error) {
    next(error)
  }
});

router.post('/login', checkUsernameAndPasswordNotEmpty, async (req, res, next) => {
  const { username, userpassword } = req.body;
  try {
    User.findOne({username})
      .then(user => {
        if(!user) {
          return res.status(404).json({ data: 'Nombre de usuario o contraseña incorrectos.'});
        }
        if (bcrypt.compareSync(password, user.password)) {
          req.session.currentUser = user;
          return res.status(200).json(user);
        } else {
          return res.status(404).json({ data: 'Nombre de usuario o contraseña incorrectos.'});
        }
      })
      .catch(error => {
        return res.status(404).json({ data: "user-not-found" });
      });
  } catch (error){ 
    next(error)
  }
});

router.get('/logout', (req, res, next) => {
  req.session.destroy(error=>{
    if(error) {
      next(error)
    }
    return res.status(204).send()
  })
});


module.exports = router;