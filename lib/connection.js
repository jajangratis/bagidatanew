const mongoose = require('mongoose');
//Kantor
// mongoose.connect('mongodb://192.168.88.56:27017/bagidataswitch');

//Bootcamp
mongoose.connect('mongodb://192.168.0.12:27017/bagidataswitch');

mongoose.Promise = global.Promise;