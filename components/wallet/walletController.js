const express = require('express');
const User = require('../user/userModel');
const Wallet = require('./walletModel')
const router = express.Router();
const jwt = require('jsonwebtoken');

router.patch('/',function(req,res){
    User.findOne({_id:req.body.id})
        .then(function (data) {
            var wallet = new Wallet({
                user : req.body.user,
                type:req.body.type,
                amount:req.body.amount,
                drcr:req.body.drcr,
                statement:req.body.statement
            })
            wallet.save()
                .then(function (result) {

                    if (req.body.type=='cash') {
                        if (req.body.drcr == 'debit') {
                            User.updateOne({ _id: req.body.user }, { $inc: { cash: req.body.amount } })
                                .then(test => {
                                    res.status(200).send("Berhasil Menambah Cash")
                                })
                                .catch(err => {
                                    res.status(401).send(err)
                                })
                        }
                        else 
                        if(req.body.drcr == 'kredit'){
                            User.updateOne({ _id: req.body.user }, { $inc: { cash: -req.body.amount } })
                                .then(test => {
                                    res.status(200).send("Saldo Dipakai")
                                })
                                .catch(err => {
                                    res.status(401).send(err)
                                })
                        }else{
                            res.send("dcdr error")
                        }
                    }
                    else if (req.body.type=='point') {
                        if (req.body.drcr == 'debit') {
                            User.updateOne({ _id: req.body.user }, { $inc: { point: req.body.amount } })
                                .then(test => {
                                    res.status(200).send("Berhasil Menambah point")
                                })
                                .catch(err => {
                                    res.status(401).send(err)
                                })
                        }
                        else if(req.body.drcr == 'kredit'){
                            User.updateOne({ _id: req.body.user }, { $inc: { point: -req.body.amount } })
                                .then(test => {
                                    res.status(200).send("point Dipakai")
                                })
                                .catch(err => {
                                    res.status(401).send(err)
                                })
                        }else{res.send('erer')}
                    }else{
                        res.send('here')
                    }

                })
                .catch(err=>{
                    res.status(422).send("err")
                })
        })
        .catch(err=>{
            res.send("errawal")
        })
})

router.get('/all', function(req, res){
    Wallet.find({}).then(function(results){
        res.send(results);
        // console.log(UserToken)
        //res.send(jwt.decode(GlobalToken))
    }).catch(err=>{
        res.send(err)
    });
});

router.get('/:userid/:drcr',function(req,res) {
    Wallet.find({user:req.params.userid,drcr:req.params.drcr})
        .then(data=>{
            res.send(data)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.delete('/:id', function(req, res){
    Wallet.find({_id:req.params.id}).then(function(results){
        res.send(results);
        // console.log(UserToken)
        //res.send(jwt.decode(GlobalToken))
    }).catch(err=>{
        res.send(err)
    });
});

module.exports = router;