const express = require('express');
const app = express();

// Kantor
// const host = '192.168.88.56';
// const port = process.env.port ||9696;

// bootcamp
// const host = '192.168.0.15';
// const host = 'localhost'
const host = 'hpku.com'
const port = process.env.port || 9696;

const logger = require('morgan')
const path = require('path')

const bodyParser = require('body-parser');
const passport = require('passport');
const passportSetup = require('./config/passport-setup');
const User = require('./components/user/userController');
const User_Personal_Information = require('./components/user/user_personal_informationController')
const Detail_Personal_Information = require('./components/detail/detail_personal_informationController')
const Group_Personal_Information = require('./components/group/group_personal_informationController')
const AccessToken = require('./components/access_token/accesstokenController')
const Crawled_data = require('./components/crawl/crawled_dataController')

const session = require('express-session')
const cookieParser = require('cookie-parser')

const Wallet = require('./components/wallet/walletController');

app.use(session({
    resave: false,
    saveUninitialized: true,
    secret: 'bagidata.com' 
}));
app.use(passport.initialize());
app.use(passport.session())

//connection
require('./lib/connection');
//require('./lib/crawl_connection');

//body parser
app.use(bodyParser.json());
app.use(cookieParser())

//router
app.use('/api/user', User);

app.use('/api/user/userpersonalinformation',User_Personal_Information)

app.use('/api/detail/detailpersonalinformation',Detail_Personal_Information)

app.use('/api/group/grouppersonalinformation',Group_Personal_Information)

app.use('/api/wallet', Wallet);

app.use('/api/access-token', AccessToken);

app.use('/api/crawl',Crawled_data);

// app.use('/api/gmail',Gmail)


// app.get('/api/google',function (req,res) {

//     var GoogleStrategy = require( 'passport-google-oauth2' ).Strategy;
//     passport.use(new GoogleStrategy({
//         clientID:"876666350951-etqdkh4714qvd5bkmvqrf5va21cbe9tq.apps.googleusercontent.com",
//         clientSecret: "FzFLD-Fw8mCnWXqGUzsCrzxE",
//         callbackURL: "http://localhost:9696/api/user/auth/google/redirect",
//         passReqToCallback   : true
//     },
//     function(request, accessToken, refreshToken, profile, done) {
//         User.findOrCreate({ googleId: profile.id }, function (err, user) {
//         return done(err, user);
//         });
//     }
//     ));
// })




//error middleware
// app.use(function(err,req,res,next){
//     res.status(422).send({error:"error"})
// });



app.use(function(req, res, next) {
    var allowedOrigins = ['*'];
    var origin = req.headers.origin;
    if(allowedOrigins.indexOf(origin) > -1){
         res.setHeader('Access-Control-Allow-Origin', origin);
    }
    // res.header('Access-Control-Allow-Origin', '192.168.88.56:9696');
    // res.header('Access-Control-Allow-Origin', '192.168.88.56:9696,192.168.0.12:5000,https://api.mainapi.net/token');
    res.header('Access-Control-Allow-Origin', '192.168.0.12:5000');

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
    console.log('Listening to port: ' + port);
});

// app.connect().use(connect.static('public')).listen(9696, "0.0.0.0");