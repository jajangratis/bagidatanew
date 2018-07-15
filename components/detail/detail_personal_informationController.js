const express = require('express');
const User = require('../user/userModel');
const Wallet = require('../wallet/walletModel');
const Detail_Personal_Information = require('./detail_personal_informationModel');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/',function (req,res) {
    Detail_Personal_Information.find({})
        .then(data=>{
            res.send(data)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.get('/:id',function (req,res) {
    Detail_Personal_Information.findOne({_id:req.params.id})
        .then(data=>{
            res.send(data)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.delete('/:id', function(req, res){
    Detail_Personal_Information.findOne({_id:req.params.id}).then(function(results){
        res.send(results);
        // console.log(UserToken)
        //res.send(jwt.decode(GlobalToken))
    }).catch(err=>{
        res.send(err)
    });
});

router.post('/',function (req,res) {
    
    var UDPI = new Detail_Personal_Information({
        field_id:req.body.field_id,
        nama_field:req.body.nama_field,
        tipe_field:req.body.tipe_field,
        point:req.body.point,
        cash:req.body.cash,
        group:req.body.group,
        statement:req.body.statement,
        col_size:req.body.col_size,
        order:req.body.order, 
    })
    UDPI.save()
        .then(data=>{
            //ADD UPDATE ACTION FOR USER DETAIL PERSONAL INFORMATION
            res.send(data)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.patch('/:id',function(req, res){
    Detail_Personal_Information.findOneAndUpdate({_id:req.params.id},req.body).then(function(result){
        Detail_Personal_Information.findOne({_id:req.params.id}).then(function(user){
            res.send(user);
        });
    })
    .catch(err=>{
        res.send(err);
    });
})

module.exports = router;