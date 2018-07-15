const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');
const twitterStrategy = require('passport-twitter');
const instagramStrategy = require('passport-instagram');
const facebookStrategy = require('passport-facebook');
const keys = require('./keys')
const User = require('../components/user/userModel')
const jwt = require('jsonwebtoken')

passport.serializeUser((user,done)=>{
    console.log(user)
    done(null,user.id)
})

passport.deserializeUser((id,done)=>{
    User.findById(id).then((user)=>{
        console.log(user)
        done(null,user.id)
    })
    .catch(err=>{
        console.log(err)
        done(err)
    })

})


//GOOGLE STRATEGY
passport.use(
    new googleStrategy({
        callbackURL:'/api/user/auth/google/redirect',
        clientID:keys.google.clientID,
        clientSecret:keys.google.clientSecret
    },
    (accessToken,refreshToken,profile,done)=>{
        User.findOne({googleId:profile.id}).then(currentUser=>{
            if(currentUser){
                //will be logged
                console.log("already exist ")
                // done(null,currentUser)
                if (currentUser.active == 1) {
                    GlobalToken = jwt.sign({
                        _id: currentUser._id,
                        username: currentUser.username,
                        active: currentUser.active,
                    },
                        'secret', {
                            expiresIn: '2h'
                        }
                    );
                    console.log(GlobalToken)
                    done(null,currentUser)
                } else {
                    return console.log('Gagal')
                }
            }else{
                User.findOne({username:profile.emails[0].value})
                    .then(exGoogleid=>{
                        if (exGoogleid) {
                            User.updateOne({username:profile.emails[0].value},{$set:{googleId:profile.id}})
                                .then(result=>{
                                    console.log(result)
                                    done(null,exGoogleid)
                                })
                                .catch(err=>{
                                    done(err)
                                })
                        }else{
                            new User({
                                username:profile.emails[0].value,
                                googleId:profile.id,
                                profile_picture:profile.photos[0].value,
                                active:1,
                            })
                            .save().then(data=>{
                                console.log(data)
                                done(null,data)
                                
                            }).catch(err=>{
                                console.log(err)
                            })
                        }
                    })
                
            }
        })
        .catch(err=>{
            console.log(err)
        })
    })
)


//TWITTER STRATEGY
passport.use(new twitterStrategy({
    consumerKey: keys.twitter.consumerKeys,
    consumerSecret: keys.twitter.comsumerSecret,
    callbackURL: "/api/user/auth/twitter/redirect",
    userProfileURL  : 'https://api.twitter.com/1.1/account/verify_credentials.json?include_email=true',
    // passReqToCallback : true,
  },
  
  function(token, tokenSecret, profile, done) {
    console.log(profile)
    User.findOne({twitterId:profile.id}, function(err, user) {
      if (user){
          //console.log(currentUser)
          //(null,user)
        //   if (user.active == 1) {
        //       GlobalToken = jwt.sign({
        //           _id: user._id,
        //           username: user.username,
        //           active: user.active,
        //       },
        //           'secret', {
        //               expiresIn: '2h'
        //           }
        //       );
        //       console.log(GlobalToken)
        //       done(null, profile.id)
        //   } else {
        //       return console.log('Gagal')
        //   }
          console.log('already exist')
          done(null,user)
        }else{
            User.findOne({username:profile.emails[0].value})
                .then(data=>{
                    if (data) {
                        User.updateOne({username:data.username},{$set:{twitterId:profile.id}})
                            .then(addTwitterId=>{
                                console.log(addTwitterId)
                                done(null,data)
                            })
                            .catch(err=>{
                                console.log(err)
                                done(null,err)
                            })
                    }else{
                        new User({
                            username: profile.emails[0].value,
                            twitterId: profile.id,
                            active:1,
                            profile_picture: profile.photos[0].value,
                        })
                            .save().then(data => {
                                //console.log(data)
                                done(null, data)
                            }).catch(err => {
                                console.log(err)
                            })
                        //done(null, data);
                    }
                })
                .catch(err=>{
                    done(err)
                })
            
      }
      
    });
  }
));

//INSTAGRAM STRATEGY
passport.use(new instagramStrategy({
    clientID: keys.instagram.clientID,
    clientSecret: keys.instagram.clientSecret,
    callbackURL: "/api/user/auth/instagram/redirect"
  },
  function(accessToken, refreshToken, profile, done) {
    console.log(profile)
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