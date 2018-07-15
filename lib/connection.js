const mongoose = require('mongoose');
//Kantor
//mongoose.connect('mongodb://192.168.88.56:27017/bagidataswitch');

//Bootcamp
//mongoose.connect('mongodb://192.168.0.15:27017/bagidataswitch');

//HPKU
mongoose.bagidata = mongoose.createConnection('mongodb://192.168.43.84:27017/bagidataswitch');
mongoose.crawled_data = mongoose.createConnection('mongodb://192.168.43.84:27017/crawled_data');
//mongoose.connect('mongodb://192.168.43.84:27017/crawled_data');
// mongoose.connect('mongodb://192.168.43.84:27017/bagidataswitch');

mongoose.Promise = global.Promise;

module.export = mongoose