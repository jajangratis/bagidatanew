const express = require('express');
const User = require('./userModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');


router.get('/', function(req, res){
    User.find({}).then(function(results){
        res.send(results);
        res.json({
            message:"konek broo"
        });
    })
    .catch(err=>{
        // res.status(400).json({
        //     message:err
        // })
    })
});

router.get('/:id', function(req, res){
    User.findOne({_id:req.params.id}).then(function(results){
        res.send(results);
    });
});

router.get('/name=:name', function(req, res){
    User.findOne({username:req.params.name}).then(function(results){
        res.send(results);
    });
});

router.post('/register',function(req, res, next){
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
            return res.status(501).json({
                error:err
            });
        }else{
            var regis = new User({
                username:req.body.username,
                password:hash,
                nama:req.body.nama,
                email:req.body.email,
                no_hp:req.body.no_hp
            });
            regis.save()
                .then(function(result) {
                    res.status(200).json({
                        message:result
                    });
                    next();                        
                })
                .catch(err=>{
                    res.status(501).json({
                        message:err
                    });
                });
        }
    })
})

router.get('/verifikasi/email/:email',function(req,res){
    User.findOne({email:req.params.email}).then(function(result){
        if (result === null) {
            return res.status(400).json({
                message:"Verifikasi Email Error"
            })
        }else{
            //belum selesai
            User.findOneAndUpdate({email:req.params.email},{$set:{active:1}}).then(
                res.status(200).json({
                    message:"Email Berhasil Diverifikasi"
                })     
            ).catch(err=>{
                res.status(400).json({
                    message:"Something Error"
                })
            })
        }
    })
    .catch(err=>{
        console.log(err)
    })
    ;

    User.findOne({email:req.params.email})
        
})



router.post('/login/email',function(req, res){
    User.findOne({email:req.body.email}).exec().then(function(user){
        bcrypt.compare(req.body.password, user.password, function(err, result) {
           if (err) {
            return res.status(401).json({
                message:"Unauthorized Access"
            });                   
           }
           if (result) {
               if (user.active == 1) {
                   const UserToken = jwt.sign({
                       _id: user._id,
                       username: user.username,
                       nama: user.nama,
                       no_hp: user.no_hp,
                       email: user.email,
                       active: user.active,
                   },
                       'secret', {
                           expiresIn: '2h'
                       }
                   );
                   return res.status(200).json({
                       message: "Success",
                       token: UserToken
                   });
               }else{
                   res.status(400).json({
                       message:"Akun Anda belum Diverifikasi"
                   })
               }
           }            
        })
    })
    .catch(err=>{
        res.status(501).send({
            err
        });
    });
});

router.post('/login/nohp',function(req, res){
    User.findOne({no_hp:req.body.no_hp}).exec().then(function(user){
        bcrypt.compare(req.body.password, user.password, function(err, result) {
           if (err) {
            return res.status(401).json({
                message:"Unauthorized Access"
            });                   
           }
           if (result) {
               if (user.active == 1) {
                   const UserToken = jwt.sign({
                       _id: user._id,
                       username: user.username,
                       nama: user.nama,
                       no_hp: user.no_hp,
                       email: user.email,
                       active: user.active,
                   },
                       'secret', {
                           expiresIn: '2h'
                       }
                   );
                   return res.status(200).json({
                       message: "Success",
                       token: UserToken
                   });
               }else{
                   res.status(400).json({
                       message:"Akun Anda belum Diverifikasi"
                   })
               }
           }
           return res.status(401).json({
               message:"failed"
           });             
        })
        
    })
    .catch(err=>{
        res.status(501).json({
            error:err
        });
    })
})

//Belum Ditambah OR untuk verifikasi no_hp sekaligus
//TODO:NOT COMPLETED
router.post('/lupapassword',function(req,res) {
    // console.log(req.body.email);
    // res.json({key:req.body.email})||
    User.findOne({$or:[{email:req.body.email},{no_hp:req.body.no_hp}]})
        .then(function(result) {
            a = User.findOne({$or:[{email:req.body.email},{no_hp:req.body.no_hp}]});
            b = User.findOne({no_hp:req.body.no_hp});
            if (result===null) {
                res.send("email/No handphone tidak ditemukan")
            }else{
                bcrypt.hash(req.body.new_password, 10,function(err,hash){
                    if (err) {
                        res.send(err)
                    }else{
                        User.update(b,{ $set: { password:hash}},function(response){
                            res.send("Password telah diubah silahkan login");
                        })
                    }
                })
            }
        })
        .catch(err=>{
            res.send({
                message:err
            })
        })
})



router.patch('/:id',function(req, res){
    User.findOneAndUpdate({_id:req.params.id},req.body).then(function(result){
        User.findOne({_id:req.params.id}).then(function(user){
            res.send(user);
        });
    })
    .catch(err=>{
        res.send(err);
    });
})

router.delete('/:id',function(req, res){
    User.findOneAndRemove({_id:req.params.id})
        .then(function(result){
            res.send(result)
        })
        .catch(err=>{
            res.send(err);
        })
})

// router.get('/checking',function(req,res,next){
//     if(req.headers && req.headers.authorization.split(" ")[0] === 'JWT'){
//         jwt.verify(req.headers.authorization.split(" ")[1], 'RESTFULAPIs',function(err, decode){
//             if (err) req.user = undefined;
//             req.user = decode;
//             res.json({
//                 message:"Authorized User"
//             })
//             next();
//         });
//     }else{
//         req.user = undefined;
//     }
//})

module.exports = router;
