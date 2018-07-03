const express = require('express');
const app = express();
const port = process.env.port ||9696;
const host = '0.0.0.0';
const bodyParser = require('body-parser');

const User = require('./components/user/userController')

//connection
require('./lib/connection');

//body parser
app.use(bodyParser.json());

//router
app.use('/api/user', User);

//error middleware
app.use(function(err,req,res,next){
    res.status(422).send({error:"error"})
});



app.use(function(req, res, next) {
    var allowedOrigins = ['*'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    //res.header('Access-Control-Allow-Origin', 'http://127.0.0.1:8020');
    res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.header('Access-Control-Allow-Credentials', true);
    return next();
  });


// app.listen( port,host, function(){
//     console.log('listening from 9696');
// })

// app.listen(port, host, function () {
//     console.log('listening from 9696');
// });

app.listen(port, host, function() {
    console.log('Listening to port:  ' + port);
});

// app.connect().use(connect.static('public')).listen(9696, "0.0.0.0");