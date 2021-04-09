var express = require('express');
var router = express.Router();
var usersModel = require('../models/users');

/* Sign-UP */
router.post('/sign-up', async (req, res, next) => {

  if(await usersModel.findOne({email: req.body.email})) {
    console.log('User existe déjà')
    res.render('https://rainorsun.herokuapp.com/');
  } else {
    var newUsers = new usersModel({
      username: req.body.username,
      email: req.body.email,
      password: req.body.password,
    });
    var usersSaved = await newUsers.save();
    
    req.session.user = {name: newUsers.username, id: newUsers._id};
    currentUser = req.session.user.name;
    
    res.redirect('/weather');
  }
  });
  
  /* Sign-IN */
  router.post('/sign-in', async (req, res, next) => {
    
    var connectUser = await usersModel.findOne(
      { email: req.body.email,
        password: req.body.password,});
  
  if(connectUser) {
  
    req.session.user = {name: connectUser.username, id: connectUser._id};
    currentUser = req.session.user.name;
  
    res.redirect('/weather'); 
  
  } else {
      res.redirect('https://rainorsun.herokuapp.com/');
    }
  });
  
  /* LOGOUT */
  router.get('/logout', function (req, res, next) {
      req.session.user = null
      currentUser = null
      console.log(req.session.user);
      res.redirect('https://rainorsun.herokuapp.com/');
  });

module.exports = router;
