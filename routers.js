const express =require('express');
const app = express();

const userController = require('./components/user/userController')
//User Router
app.use('/api/user',userController);

module.exports = app;
