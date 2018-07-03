const mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.43.84:27017/bagidataswitch');
mongoose.Promise = global.Promise;