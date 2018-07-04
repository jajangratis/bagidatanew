const mongoose = require('mongoose');
mongoose.connect('mongodb://192.168.88.56:27017/bagidataswitch');
mongoose.Promise = global.Promise;