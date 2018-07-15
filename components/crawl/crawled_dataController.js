const express = require('express');
const router = express.Router();
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');
const twitterStrategy = require('passport-twitter');
const instagramStrategy = require('passport-instagram');
const facebookStrategy = require('passport-facebook');
const keys = require('../../config/keys');
const User = require('../user/userModel');
const AccessToken = require('../access_token/accesstokenModel');
const jwt = require('jsonwebtoken')

router.get('/accesstoken',function(req,res) {
    AccessToken.find({})
        .then(data=>{
            res.json(data)
        })   
        .catch(err=>{
            res.send(err)
        })
})

router.get('/accesstoken/social_media/:id',function(req,res) {
    AccessToken.findOneAndRemove({id_social_media:req.params.id})
        .then(data=>{
            res.json(data)
        })   
        .catch(err=>{
            res.send(err)
        })
})

module.exports = router