const express = require('express');
const User = require('../user/userModel');
const Wallet = require('../wallet/walletModel');
const Group_Personal_Information = require('./group_personal_informationModel');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/',function (req,res) {
    Group_Personal_Information.find({})
        .then(data=>{
            res.send(data)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.get('/:id',function (req,res) {
    Group_Personal_Information.findOne({_id:req.params.id})
        .then(data=>{
            res.send(data)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.delete('/:id', function(req, res){
    Group_Personal_Information.findOne({_id:req.params.id}).then(function(results){
        res.send(results);
    }).catch(err=>{
        res.send(err)
    });
});

router.post('/',function (req,res) {
    var GPI = new Group_Personal_Information({
        nama_group:req.body.nama_group,
        order:req.body.order
    })
    GPI.save()
        .then(data=>{
            //ADD UPDATE ACTION FOR USER DETAIL PERSONAL INFORMATION
            res.send(data)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.patch('/:id',function(req, res){
    Group_Personal_Information.findOneAndUpdate({_id:req.params.id},req.body).then(function(result){
        Group_Personal_Information.findOne({_id:req.params.id}).then(function(user){
            res.send(user);
        });
    })
    .catch(err=>{
        res.send(err);
    });
})

module.exports = router;