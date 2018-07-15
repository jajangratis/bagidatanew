const mongoose = require('mongoose');
//Kantor
//mongoose.connect('mongodb://192.168.88.56:27017/bagidataswitch');

//Bootcamp
//mongoose.connect('mongodb://192.168.0.15:27017/bagidataswitch');

//HPKU
mongoose.connect('mongodb://192.168.43.84:27017/crawled_data');

mongoose.Promise = global.Promise;