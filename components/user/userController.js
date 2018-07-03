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
    });
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
            return res.status(500).json({
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
                    res.status(500).json({
                        message:err
                    });
                });
        }
    })
})

router.get('/verifikasi/:email',function(req,res){
    // if (User.findOne({email:req.body.email})==null){
    //     res.json({
    //         message:"ERROR"
    //     });
    // }else{
    //     User.findOneAndUpdate({emai:req.body.email},{active:1})
    //     res.json({
    //         message:"Sukses Aktivasi"
    //     });
    // }


    User.findOne({email:req.params.email}).then(function(result){
        if (result === null) {
            return res.status(500).json({
                message:"Eroor"
            })
        }else{
            //belum selesai
            User.findOneAndUpdate({email:req.params.email},{$set:{activate:1}},function(result) {
              res.status(200).json({
                  message:result
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
               const UserToken = jwt.sign({
                   _id:user._id,
                   username:user.username,
                   nama:user.nama,
                   no_hp:user.no_hp,
                   email:user.email,
                   

               },
               'secret',{
                   expiresIn:'2h'
               }
             );
             return res.status(200).json({
                 message:"Success",
                 token:UserToken
             });
           }
           return res.status(401).json({
               message:"failed"
           });             
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
    });
})

router.post('/login/no_hp',function(req, res){
    User.findOne({no_hp:req.body.no_hp}).exec().then(function(user){
        bcrypt.compare(req.body.password, user.password, function(err, result) {
           if (err) {
            return res.status(401).json({
                message:"Unauthorized Access"
            });                   
           }
           if (result) {
               const UserToken = jwt.sign({
                   _id:user._id,
                   username:user.username,
                   nama:user.nama,
                   no_hp:user.no_hp,
                   email:user.email,
                   

               },
               'secret',{
                   expiresIn:'2h'
               }
             );
             return res.status(200).json({
                 message:"Success",
                 token:UserToken
             });
           }
           return res.status(401).json({
               message:"failed"
           });             
        })
        .catch(err=>{
            res.status(500).json({
                error:err
            });
        });
    });
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
