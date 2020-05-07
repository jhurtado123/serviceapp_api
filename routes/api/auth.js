const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../../models/User");

router.get('/whoami', (req, res, next) => {
  if(req.session.currentUser) {
    res.status(200).json(req.session.currentUser)
  } else {
    res.status(401).json({code:'not-authorized'})
  }
});

router.post('/signup', async (req, res, next) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username});
    if (user) {
      return res.status(422).json({ code: 'username-not-unique'})
    }
    const salt = bcrypt.genSaltSync(10);
    const hash = bcrypt.hashSync(password, salt);
    
    const newUser = await User.create({
      username,
      password: hash,
    });
    req.session.currentUser = newUser;
    return res.json(newUser);
  } catch (error) {
    next(error)
  }
});

router.post('/login', async (req, res, next) => {
  const { username, userpassword } = req.body;
  try {
    const user = await User.findOne({username});
    if(!user) {
      return res.status(404).json({ code: 'user-not-found'});
    }
    if (bcrypt.compareSync(userpassword, user.password)) {
      req.session.currentUser = user;
      return res.json(user);
    }
    return res.status(404).json({ code: "user-not-found" });
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