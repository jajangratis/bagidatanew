const express = require('express');
const User = require('./userModel');
const User_Personal_Information = require('./user_personal_informationModel')
const Detail_Personal_Infomation = require('../detail/detail_personal_informationModel')
const Wallet = require('../wallet/walletModel')
const router = express.Router();
const jwt = require('jsonwebtoken');
require('set-timezone')('Asia/Jakarta')

//INPUT DATA
// router.post('/',function (req,res) {
    // var now = new Date()
    // var UPI = new User_Personal_Information({
    //     field_id:req.body.field_id,
    //     user:req.body.user,
    //     value:req.body.value
    // })
    // UPI.save()
    //     .then(data=>{
    //         // res.send(data.field_id)
    //         Detail_Personal_Infomation.findOne({_id:data.field_id})
    //             .then(tb_detail=>{
    //                 User.updateOne({_id:data.user},{ $inc: { cash: tb_detail.cash, point:tb_detail.point }})
    //                     .then(hasil=>{
    //                         res.send("Selamat Anda Mendapatkan Bonus")
    //                     })
    //                     .catch(err=>{
    //                         res.send(err)
    //                     })
    //             })
    //             .catch(err=>{
    //                 res.send(err)
    //             })
    //     })
    //     .catch(err=>{
    //         res.send(err)
    //     })
// })


router.post('/',function (req,res) {
    User_Personal_Information.updateMany({user:req.body.user},{$set:{endda:new Date(Date.now() - 86400000)}})
        .then(function(data) {
            //var now = new Date()
            var UPI = new User_Personal_Information({
                field_id:req.body.field_id,
                user:req.body.user,
                value:req.body.value,
                endda:new Date("2200-12-12")
            }).populate("user",'username').populate("field_id",['nama_field','statement','point','cash'])
            UPI.save()
                .then(data=>{
                    // res.send(data.field_id)
                    Detail_Personal_Infomation.findOne({_id:data.field_id})
                        .then(tb_detail=>{
                            if (tb_detail.cash == 0) {
                                var to_wallet = new Wallet({
                                    user:data.user,
                                    type:'point',
                                    amount:tb_detail.point,
                                    drcr:'debit',
                                    statement:tb_detail.statement
                                })
                                to_wallet.save()
                                    .then(hasil=>{
                                        User.updateOne({_id:data.user},{ $inc: { cash: tb_detail.cash, point:tb_detail.point }})
                                            .then(hasil=>{
                                                res.send("Selamat Anda Mendapatkan Bonus point Sebesar"+tb_detail.point)
                                            })
                                            .catch(err=>{
                                                res.send(err)
                                            })
                                    })
                                    .catch(err=>{
                                        res.send(err)
                                    })
                            }else
                            if (tb_detail.point == 0) {
                                var to_wallet = new Wallet({
                                    user:data.user,
                                    type:'cash',
                                    amount:tb_detail.cash,
                                    drcr:'debit',
                                    statement:tb_detail.statement
                                })
                                to_wallet.save()
                                    .then(hasil=>{
                                        User.updateOne({_id:data.user},{ $inc: { cash: tb_detail.cash, point:tb_detail.point }})
                                            .then(hasil=>{
                                                res.send("Selamat Anda Mendapatkan Bonus cash Sebesar"+tb_detail.cash)
                                            })
                                            .catch(err=>{
                                                res.send(err)
                                            })
                                    })
                                    .catch(err=>{
                                        res.send(err)
                                    })
                            }else{
                                res.send('something error')
                            }
                            // User.updateOne({_id:data.user},{ $inc: { cash: tb_detail.cash, point:tb_detail.point }})
                            //     .then(hasil=>{
                            //         res.send("Selamat Anda Mendapatkan Bonus")
                            //     })
                            //     .catch(err=>{
                            //         res.send(err)
                            //     })
                        })
                        .catch(err=>{
                            res.send(err)
                        })
                })
                .catch(err=>{
                    res.send(err)
                })
        })
        .catch(err=>{
            res.send(err)
        })
})



//GET ALL DATA
router.get('/all',function(req,res) {
    User_Personal_Information.find({}).populate("user",'username').populate("field_id",['nama_field','statement','point','cash'])
        .then(function(data) {
            res.send(data)
        })
        .catch(err=>{
            res.send(err)
        })
})


//DELETE BY ID
router.delete('/:id',function (req,res) {
    User_Personal_Information.findByIdAndRemove({_id:req.params.id})
        .then(data=>{
            res.send("DATA BERHASIL DIHAPUS")
        })
        .catch(err=>{
            res.send(err)
        })
})

//EDIT BY ID
router.patch('/:id',function(req, res){
    User_Personal_Information.findOneAndUpdate({_id:req.params.id},req.body).then(function(result){
        User_Personal_Information.findOne({_id:req.params.id}).then(function(user){
            res.send(user);
        });
    })
    .catch(err=>{
        res.send(err);
    });
})
module.exports = router;