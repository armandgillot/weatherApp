var express = require('express');
var router = express.Router();
var request = require('sync-request');

var bdd = require('../models/bdd');
var citiesModel = require('../models/cities');
var usersModel = require('../models/users');

var error404 = false;

// supprimer les accents
function cleanUpSpecialChars(str) {
  str = str.replace(/é|è|ê/g, "e");
  return str;
}
// Mettre la premiere lettre en majuscule
function strUcFirst(a){return (a+'').charAt(0).toUpperCase()+a.substr(1);}

/* Login Home */
router.get('/', function (req, res, next) {
  if(req.session.user) {
    res.redirect('/weather');
  } else {
  res.render('login');
}
});

/* Weather. */
router.get('/weather', async (req, res, next) => {
  
  if(!req.session.user) {
    res.redirect('/')
  }
  var currentUser = req.session.user.name;

  var cityList = await citiesModel.find({idUser: req.session.user.id});
  for (let i = 0; i < cityList.length; i++) {

    var requete = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cleanUpSpecialChars(cityList[i].city)}&lang=fr&units=metric&appid=9da6b63f214e77766e16f592bdb466ed`);
    var resultWS = JSON.parse(requete.body);

    await citiesModel.updateOne(
      { _id: cityList[i].id },
      {
        city: cityList[i].city,
        image: "http://openweathermap.org/img/w/" + resultWS.weather[0].icon + ".png",
        description: strUcFirst(resultWS.weather[0].description),
        max: resultWS.main.temp_max,
        min: resultWS.main.temp_min
      });
  }
  var cityList = await citiesModel.find({idUser: req.session.user.id});

  res.render('weather', { cityList, error404, currentUser});
});

/* Add city. */
router.post('/add-city', async (req, res, next) => {
  var cityList = await citiesModel.find({idUser: req.session.user.id});
  if (req.body.newCity === "") {
  } else {
    var requete = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cleanUpSpecialChars(req.body.newCity)}&lang=fr&units=metric&appid=9da6b63f214e77766e16f592bdb466ed`);
    var resultWS = JSON.parse(requete.body);

    var exist = false;
    if (resultWS.name) {
      for (i = 0; i < cityList.length; i++) {
        if (resultWS.name.toLowerCase() === cityList[i].city.toLowerCase()) {
          exist = true;
        }
      }
    }
    if (exist == false) {
      if (resultWS.cod == 404) {
        var error404 = true;
      } else {
        var newCities = new citiesModel({
          city: resultWS.name,
          image: "http://openweathermap.org/img/w/" + resultWS.weather[0].icon + ".png",
          description: resultWS.weather[0].description,
          max: resultWS.main.temp_max,
          min: resultWS.main.temp_min,
          lat: resultWS.coord.lat,
          lon: resultWS.coord.lon,
          idUser: req.session.user.id
        });
        var citiesSaved = await newCities.save();
        var error404 = false;
      }
    }
    var cityList = await citiesModel.find({idUser: req.session.user.id});
  }

  res.redirect('/weather');
});

/* Delete city. */
router.get('/delete-city', async (req, res, next) => {

  await citiesModel.deleteOne(
    { _id: req.query.deleteCity }
  );

  var cityList = await citiesModel.find({idUser: req.session.user.id});

  res.redirect('/weather');
});

/* Update-data. */
router.get('/update-data', async (req, res, next) => {

  var cityList = await citiesModel.find({idUser: req.session.user.id});

  for (let i = 0; i < cityList.length; i++) {

    var requete = request("GET", `https://api.openweathermap.org/data/2.5/weather?q=${cleanUpSpecialChars(cityList[i].city)}&lang=fr&units=metric&appid=9da6b63f214e77766e16f592bdb466ed`);
    var resultWS = JSON.parse(requete.body);

    await citiesModel.updateOne(
      { _id: cityList[i].id },
      {
        city: cityList[i].city,
        image: "http://openweathermap.org/img/w/" + resultWS.weather[0].icon + ".png",
        description: resultWS.weather[0].description,
        max: resultWS.main.temp_max,
        min: resultWS.main.temp_min
      });
  }
  var cityList = await citiesModel.find({idUser: req.session.user.id});

  res.redirect('/weather');
});

module.exports = router;