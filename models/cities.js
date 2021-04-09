var mongoose = require('mongoose');

var citiesSchema = mongoose.Schema({
    city: String,
    image: String,
    description: String,
    max: String,
    min: String,
    lat: String,
    lon: String,
    idUser: String
  });
 
 var citiesModel = mongoose.model('cities', citiesSchema);

 module.exports = citiesModel;