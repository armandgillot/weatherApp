var mongoose = require('mongoose');

// connexion à la BDD
var options = {
    connectTimeoutMS: 5000,
    useNewUrlParser: true,
    useUnifiedTopology : true
   }
mongoose.connect('mongodb+srv://armandgillot:jyd1Y3XNIDCqoi7Q@cluster0.gif5n.mongodb.net/weatherapp?retryWrites=true&w=majority',
    options,        
    function(err) {
    console.log(err);
    }
);