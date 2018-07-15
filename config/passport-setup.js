const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');
const twitterStrategy = require('passport-twitter');
const instagramStrategy = require('passport-instagram');
const facebookStrategy = require('passport-facebook');
const keys = require('./keys')
const User = require('../components/user/userModel')
const jwt = require('jsonwebtoken')

passport.serializeUser((result,done)=>{
    //console.log(user)
    done(null,result)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        console.log(user)
        done(null,user)
    })
    .catch(err=>{
        console.log(err)
        done(err)
    })

})


//GOOGLE STRATEGY
passport.use(
    new googleStrategy({
        callbackURL:'/api/access-token/google/redirect',
        clientID:keys.google.clientID,
        clientSecret:keys.google.clientSecret
    },
    (accessToken,refreshToken,profile,done)=>{
        done(null,{token:accessToken,user_id:profile.id})
    })
)


//TWITTER STRATEGY
passport.use(new twitterStrategy({
    consumerKey: keys.twitter.consumerKeys,
    consumerSecret: keys.twitter.comsumerSecret,
    callbackURL: "/api/access-token/twitter/redirect",
    userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    // passReqToCallback : true,
  },
  
  function(token, tokenSecret, profile, done) {
    console.log(tokenSecret)
    done(null,{token:token,user_id:profile.id,tokenSecret:tokenSecret})
  }
));

//INSTAGRAM STRATEGY
passport.use(new instagramStrategy({
    clientID: keys.instagram.clientID,
    clientSecret: keys.instagram.clientSecret,
    callbackURL: "/api/user/auth/instagram/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    done(null,{accesstoken:accessToken,user_id:profile.id})
  }
));

//FACEBOOK STRATEGY
passport.use(new facebookStrategy({
    clientID: keys.facebook.appID,
    clientSecret: keys.facebook.appSecret,
    callbackURL: "/auth/facebook/redirect",
    profileFields: ['id', 'displayName', 'photos', 'email']
  },
  function(accessToken, refreshToken, profile, cb) {
    console.log(profile)
  }
));