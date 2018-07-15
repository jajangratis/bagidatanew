const express = require('express');
const router = express.Router();
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');
const twitterStrategy = require('passport-twitter');
const instagramStrategy = require('passport-instagram');
const facebookStrategy = require('passport-facebook');
const keys = require('../../config/keys');
const User = require('../user/userModel');
const AccessToken = require('./accesstokenModel');
const jwt = require('jsonwebtoken')

const dummy = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YjQ5ZjFmNTFhZDFkZDI4NmE2OTM0MTYiLCJ1c2VybmFtZSI6InRyaWFuZ2FudGVuZzEyMzRAZ21haWwuY29tIiwiYWN0aXZlIjoxLCJpYXQiOjE1MzE1NzI3OTgsImV4cCI6MTUzMTU3OTk5OH0.-wfoKGIzf_i1PejOrCx2SyXkEEPEOXyq3zBqhRWVQ9E"

router.get('/google',passport.authenticate('google',{
    scope:['profile','email']
}))

router.get('/google/redirect',passport.authenticate('google'),(req,res)=>{
    // console.log(req.user)
    // res.json(req.user)
    console.log(req.cookies)
    const jwtToken = jwt.decode(req.cookies.jwtToken)
    add = new AccessToken({
        id_user:jwtToken._id,
        id_social_media:1,
        user_id:req.user.user_id,
        token:req.user.token,
    });
    add.save()
        .then(addRes=>{
            res.json(addRes)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.get('/twitter',passport.authenticate('twitter',{
    scope:['profile']
}))

router.get('/twitter/redirect',passport.authenticate('twitter'),(req,res)=>{
    // console.log(req.user)
    // res.json(req.user)
    console.log(req.user)
    const jwtToken = jwt.decode(req.cookies.jwtToken)
    add = new AccessToken({
        id_user:jwtToken._id,
        id_social_media:2,
        user_id:req.user.user_id,
        token:req.user.token,
        token_secret:req.user.tokenSecret
    });
    add.save()
        .then(addRes=>{
            res.json(addRes)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.get('/auth/instagram',
  passport.authenticate('instagram'));

router.get('/auth/instagram/callback', 
  passport.authenticate('instagram', { failureRedirect: '/login' }),
  function(req, res) {
    // Successful authentication, redirect home.
    res.redirect('/');
  })


router.get('/getalldata',function(req,res) {
    AccessToken.find({})
        .then(data=>{
            res.json(data)
        })   
        .catch(err=>{
            res.send(err)
        })
})

router.delete('/getalldata/:id',function(req,res) {
    AccessToken.findOneAndRemove({_id:req.params.id})
        .then(data=>{
            res.json(data)
        })   
        .catch(err=>{
            res.send(err)
        })
})

module.exports = router;