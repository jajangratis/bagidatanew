const express = require('express');
const User = require('./userModel');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const axios = require('axios');
const validator = require("validator");
const curl = new (require( 'curl-request' ))();
const nodemailer = require('nodemailer');
const Email = require('email-templates').Email;
const Cryptr = require('cryptr');
const cryptr = new Cryptr('myTotalySecretKey');
var util = require('util');
var exec = require('child_process').exec;
const RateLimiter = require('limiter').RateLimiter;
const limiter = new RateLimiter(5, 'second');
var Client = require('node-rest-client').Client; 
var client = new Client();
var base64 = require('base-64');
var randomize = require('randomatic');
const passport = require('passport');
const googleStrategy = require('passport-google-oauth20');
const keys = require('../../config/keys')


var fullToken
var GlobalToken 
var getToken

function apiToken(keysecret) {
    // var command = "curl -X POST --header 'Content-type:application/x-www-form-urlencoded' --header 'authorization:Basic Q3FSRUdpR2ZxOUROdEhhckRQcnBXdjlYWkFnYTpSNnBxb3pxRldVSEhDMzhBdFdxekFhcXhWZklh' --data 'grant_type=client_credentials' 'https://api.mainapi.net/token' ";
    // child = exec(command, function (error, stdout, stderr) {
    //     const test = JSON.parse(stdout)
    //     getToken = test.access_token
    //     console.log(getToken)
    // })
    var cred = base64.encode(keysecret)
    var args = {
        data: { 
            'grant_type':'client_credentials'
        },
        headers: { 
            "Authorization" : "Basic "+cred,
            "Content-Type": "application/x-www-form-urlencoded",
         }
    };
    client.post("https://api.mainapi.net/token", args, function (data, response) {
        // parsed response body as js object
        fullToken = data.access_token;
        res.send(data);
        // raw response
        // res.send(response);
    });
}

// apiToken("CqREGiGfq9DNtHarDPrpWv9XZAga","R6pqozqFWUHHC38AtWqzAaqxVfIa");

router.post('/gettoken',function(req,res) {
    // var cred = base64.encode(req.body.keysecret)
    var cred = base64.encode("q4hOnRuJPm63m4d1j5LHI65VCa0a:S_FA0ucNMKd9exs8QdrD_Flz3Pga")
    var args = {
        data: { 
            'grant_type':'client_credentials'
        },
        headers: { 
            "Authorization" : "Basic "+cred,
            "Content-Type": "application/x-www-form-urlencoded",
         }
    };
    client.post("https://api.mainapi.net/token", args, function (data, response) {
        // parsed response body as js object
        fullToken = data.access_token;
        res.send(data);
        // raw response
        // res.send(response);
    });
})


router.patch('/verifikasisms',function(req,res) {
    const verfkey = randomize('0', 6);
    
    User.find({username:req.body.username})
    .then(isi=>{
        if (isi===null) {
            res.send('Data Tidak Ditemukan')
        }else{
            User.findOneAndUpdate({username:req.body.username},{$set:{verificationkey:verfkey}})
                .then(result=>{
                    // const tet = apiToken("fe2NaqqPfw2cAvZ5_2AnCkUnW1Ea:YiYfyz_VK5S3Ms_RhVf5ffN7i2Aa")
                    //res.send(result)
                    var args = {
                        data: {
                            msisdn: req.body.username, //Nomor User or id,
                            content: "Nomor Verifikasi Anda " + verfkey,
                        },
                        headers: {
                            "Authorization": "Bearer "+fullToken,
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": 'application/json',
                        }
                    };
                    client.post("https://api.mainapi.net/smsnotification/1.0.0/messages", args, function (result1, response) {
                        // parsed response body as js object
                        // res.send(fullToken)
                        res.send(result1);
                        // raw response
                        // res.send(response);
                    });
                })
                .catch(err=>{
                    res.send(err)
                })
        }
        
    })
    .catch(err=>{
        res.send(err)
    })
})

router.post('/verifikasisms/checking',function(req,res) {
    User.findOne({username:req.body.username})
        .then(result=>{
            if (result.verificationkey == req.body.verificationkey) {
                User.findOneAndUpdate({username:req.body.username},{$set:{active:1}})
                .then(hasil=>{
                    res.send("Berhasil Diaktivasi silahkan login")
                })
                .catch(err=>{
                    res.send(err)
                })
            }else{
                res.send('Kode tidak sama silahkan coba lagi')
            }
        })
        .catch(err=>{
            res.send(err)
        })    
})

router.post('/login',function(req, res){
    //{$or:[{email:req.body.cek},{no_hp:req.body.cek}]}
    // const test = bcrypt.compare(req.body.password, user.password)
    User.findOne({username:req.body.username}).exec().then(function(user){
        if (user===null) {
            res.status(422).send("username/password Tidak Valid")
        }else{
            bcrypt.compare(req.body.password,user.password,function(err,hash) {
                if(hash){
                    if (user.active == 1) {
                        GlobalToken = jwt.sign({
                            _id: user._id,
                            username: user.username,
                            active: user.active,
                        },
                            'secret', {
                                expiresIn: '2h'
                            }
                        );
                        res.cookie('jwtToken', GlobalToken).status(200).json({
                            message: "Success",
                            token: GlobalToken
                        });
                    } else {
                        res.status(401).json({
                            message: "Akun Anda belum Diverifikasi"
                        })
                    }
                }else{
                    res.status(422).json({
                        message:"Username / Password salah"
                    })
                }
                
            })
        }
    })
    .catch(err=>{
        res.status(422).json({
            message:"ERROROO"
        })
    })
})


router.get('/', function(req, res){
    User.find({}).then(function(results){
        res.send(results);
        // console.log('jwtToken: ', req.cookies);
    })
    .catch(err=>{
        res.status(422).send(err)
    })
});

router.get('/:id', function(req, res){
    User.findOne({_id:req.params.id}).then(function(results){
        res.send(results);
        // console.log(UserToken)
        //res.send(jwt.decode(GlobalToken))
    }).catch(err=>{
        res.send(err)
    });
});


router.post('/register',function(req, res, next){
    bcrypt.hash(req.body.password, 10, function(err, hash) {
        if (err) {
            return res.status(401).json({
                error:err
            });
        }else{
            // if (validator.isNumeric(req.body.username)||validator.isEmail(req.body.username)) {
            if (validator.isMobilePhone(req.body.username,"any")||validator.isEmail(req.body.username)) {
                var regis = new User({
                    username:req.body.username,
                    password:hash
                })
                regis.save()
                // mongoose.bagidata.collection('users').insert({
                //     username:req.body.username,
                //     password:hash
                // })
                // User.insert({
                //     username:req.body.username,
                //     password:hash
                // })
                .then(function(result) {
                    console.log(result)
                    User.findOne({_id:result._id})
                        .then(function(data) {
                            res.status(200).send(data)
                            // res.redirect(307,"http://192.168.88.56:9696/api/user/email/"+cryptr.encrypt(data._id));
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                })
                .catch(err=>{
                    res.status(401).json({
                        message:"Pastikan Email atau nomor telepon Unik"
                    });
                });
            }else{
                res.status(401).send('Harus Berupa Email atau Nomor Telepon')
            }
        }
    })
})

router.get('/verifikasi/email/:username',function(req,res){
    User.findOne({username:req.params.username}).then(function(result){
        if (result === null) {
            return res.status(422).json({
                message:"Verifikasi Error"
            })
        }else{
            //belum selesai
            if (validator.isEmail(req.params.username) && (result.username == req.params.username)) {
                //bagian validasi email
                User.findOneAndUpdate({ username: req.params.username }, { $set: { active: 1 } }).then(
                    res.status(200).send({
                        message: "Email Berhasil Diverifikasi"
                    })
                    
                ).catch(err => {
                    res.status(422).send({
                        message: "Something Error"
                    })
                })
            }else{
                res.status(422).send("Email Anda tidak valid");
            }
            // if (validator.isMobilePhone(req.params.username) && (result.username == req.params.username)) {
            //     //bagian validasi pake nomor hape
            //     res.status(422).send("Email Anda tidak valid");
            // }
        }
    })
    .catch(err=>{
        console.log(err)
    });
        
})



// curl('https://api.mainapi.net/token', function(err) {
    
//   });

// axios({
//     method: 'post',
//     url: 'https://api.mainapi.net/token',
//     header:{
//         "Authorization":"Basic C0Iv6RP5pP9wTYKQeljkrEatMiga:mroFIL_D3J_8pz9PFB92divTGnwa",
//         'Content-type': 'application/x-www-form-urlencoded',
//     },
//     data: {
//         grant_type: 'client_credentials'
//     }
//   }).then(res=>{console.log(res)}).catch(err=>{console.log(err)});







// router.post('/gettoken',function(req,res,next) {
//     const apikey="Basic C0Iv6RP5pP9wTYKQeljkrEatMiga:mroFIL_D3J_8pz9PFB92divTGnwa"
//     res.setHeader('Authorization',apikey)
//     console.log(res.getHeader)
    
// });


router.post('/checking',function(req,res) {
    // console.log(req.body.email);
    // res.json({key:req.body.email})||
    if (validator.isEmail(req.body.username)||validator.isMobilePhone(res.body.username)) {
        User.findOne({username:req.body.username})
            .then(
                res.status(401).send("Akun telah dipakai")
            )
            .catch(err=>{
                res.status(200).send("akun dapat dipakai")
            })
    }else{
        res.status(422).send("Tolong masukan email")
    }
    
})

router.get('/email/:id',function(req,res) {   
    // Generate test SMTP service account from ethereal.email
    // Only needed if you don't have a real mail account for testing
        // const dec = cryptr.decrypt(req.params.id)
    // console.log(req.params.id)
    User.findOne({_id:req.params.id})
        .then(function(data) {
            if(data === null){
                res.send('Error')
            }else{
                nodemailer.createTestAccount((err, account) => {
                    // create reusable transporter object using the default SMTP transport
                    let transporter = nodemailer.createTransport({
                        host: 'bagidata.com',
                        port: 587,
                        requireTLS: false, //Force TLS
                        secure: false, // true for 465, false for other ports
                        auth: {
                            user: 'hello@bagidata.com', // generated ethereal user
                            pass: 'modalbangsa' // generated ethereal password
                        },
                        tls: {
                            rejectUnauthorized: false
                        }
                    });
    
                    // setup email data with unicode symbols
                    let mailOptions = {
                        from: 'hello@bagidata.com',
                        to: data.username,
                        subject: 'Aktivasi Akun',
                        text: 'Tinggal Selagkah lagi',
                        html: "<div align='center'><h1 align='center'>Klik Link ini untuk aktivasi akun anda</h1> <br><a href='http://instancehilmi.000webhostapp.com/deeplink.php?page=verifikasiemail&value=" + data.username + "' target='_blank' > <input type=  'submit' value='Klik ini '/></form></div>"
                    };
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return res.status(422).send('err0r');
                        } else {
                            return res.status(200).send('Message sent: %s', info.messageId);
                        }
                    });
                });
            }
        })
        .catch(err=>{
            res.send(err)
        })
        
    
})

// router.post('/lupapassword/newpassword/',function(req,res) {
//     // const id = cryptr.decrypt(req.body.id);
//     a = User.findOne({_id:id});
//     User.findOne({_id:req.body.id})
//     .then(function(data) {
//         res.send(data)
//     })
//     .catch(err=>{
//         res.status(422).send(err)
//     })
// })


router.patch('/lupapassword',function(req,res) {
    // res.send("req.body.email");
    // res.json({key:req.body.email})||
    User.findOne({username:req.body.username})
        .then(function(result) {  
            a = User.findOne({username:req.body.username});
            if (result===null) {
                res.send("email/No handphone tidak ditemukan")
            }else{
                if (validator.isEmail(req.body.username)) {
                    nodemailer.createTestAccount((err, account) => {
                        // create reusable transporter object using the default SMTP transport
                        let transporter = nodemailer.createTransport({
                            host: 'bagidata.com',
                            port:587,
                            requireTLS: false, //Force TLS
                            secure: false, // true for 465, false for other ports
                            auth: {
                                user: 'hello@bagidata.com', // generated ethereal user
                                pass: 'modalbangsa' // generated ethereal password
                            },
                            tls: {
                                rejectUnauthorized: false
                            }
                        });
            
                        // setup email data with unicode symbols
                        let mailOptions = {
                            from: 'hello@bagidata.com',
                            to: req.body.username,
                            subject: 'Lupa Password',
                            text: 'Tinggal Selagkah lagi',
                            html:"<h1>Klik Link ini untuk merubah password akun anda </h1><br><button align='center'><a  href='http://instancehilmi.000webhostapp.com/deeplink.php?page=ChangePassword&value="+cryptr.encrypt(result.username)+"'>LUPA PASSWORD</a></button>"
                            // html: "<div align='center'><h1 align='center'>Klik Link ini untuk mereset password akun anda</h1> <br><button><a href='http://192.168.88.56:9696/api/user/email/newpassword/"+cryptr.encrypt(result._id)+"'>AKTIVASI</a></button></div>"
                        };
                        // send mail with defined transport object
                        transporter.sendMail(mailOptions, (error, info) => {
                            if (error) {
                                return res.status(200).send(error);
                            }else{
                                return res.status(200).send('Message sent: %s', info.messageId);
                            }
                        });
                    });
                }else{
                    resetkey = randomize('0',6)
                    var args = {
                        data: {
                            msisdn: req.body.username, //Nomor User or id,
                            content: "Nomor Reset password Anda " + resetkey,
                        },
                        headers: {
                            "Authorization": "Bearer "+fullToken,
                            "Content-Type": "application/x-www-form-urlencoded",
                            "Accept": 'application/json',
                        }
                    };
                    client.post("https://api.mainapi.net/smsnotification/1.0.0/messages", args, function (result1, response) {
                        // parsed response body as js object
                        // res.send(fullToken)
                        res.send(result1);
                        // raw response
                        // res.send(response);
                    });
                }
            }
        })
        .catch(err=>{
            res.send({
                message:"err"
            })
        })
})


//Belum Ditambah OR untuk verifikasi no_hp sekaligus
//TODO:NOT COMPLETED
router.post('/lupapassword/reset',function(req,res) {
    // console.log(req.body.email);
    // res.json({key:req.body.email})||
    decUsername = cryptr.decrypt(req.body.username)
    User.findOne({username:decUsername})
        .then(function(result) {
            a = User.findOne({username:decUsername});
            if (result===null) {
                res.send("email/No handphone tidak ditemukan")
            }else{
                if (validator.isEmail(decUsername)||validator.isMobilePhone(decUsername)) {
                    bcrypt.hash(req.body.new_password, 10,function(err,hash){
                        if (err) {
                            res.send(err)
                        }else{
                            User.update(a,{ $set: { password:hash}},function(response){
                                res.status(200).send("Password telah diubah silahkan login");
                            })
                        }
                    })
                }else{
                    res.status(422).send('data tidak valid')
                }
                // if (validator.isMobilePhone(req.body.username,"any")) {
                //     console.log('lupa password mobile')
                // }
            }
        })
        .catch(err=>{
            res.send({
                message:err
            })
        })
})

router.post('/lupapassword/checking',function(req,res) {
    User.findOne({username:req.body.username})
        .then(result=>{
            if (result.verificationkey == req.body.verificationkey) {
                res.send(200).send("Berhasil")
            }else{
                res.status(401).send('Kode tidak sama silahkan coba lagi')
            }
        })
        .catch(err=>{
            res.send(err)
        })    
})


router.post('/gantipassword',function(req,res) {
    // console.log(req.body.email);
    // res.json({key:req.body.email})||
    User.findOne({username:req.body.username})
        .then(function(result) {
            a = User.findOne({username:req.body.username});
            if (result==null) {
                res.send("email/No handphone tidak ditemukan")
            }else{
                bcrypt.compare(req.body.old_password,result.password,function(err,hash){
                    if(hash){
                        bcrypt.hash(req.body.new_password, 10, function (err, hash) {
                            if (err) {
                                res.send(err)
                            } else {
                                User.updateOne(a, { $set: { password: hash } }, function (response) {
                                    res.send("password telah diubah silahkan login");
                                })
                            }
                        })
                    }else{
                        if (err) {
                            res.status(422).send("password lama salah")
                        }
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

///SETUP GOOGLE PLUS API


router.get('/auth/google',passport.authenticate('google',{
    scope:['profile','email']
}))

router.get('/auth/google/redirect',passport.authenticate('google'),(req,res)=>{
     console.log(req.user)
     res.json(req.user)
    // const data = req.user
    // User.findOne({googleId:data.googleId})
    //     .then(login=>{
    //         // if (login.active == 1) {
                
    //         // } else {
    //         //     res.status(401).json({
    //         //         message: "Akun Anda belum Diverifikasi"
    //         //     })
    //         // }
    //         GlobalToken = jwt.sign({
    //             _id: login._id,
    //             googleId:login.googleId,
    //             username: login.username,
    //             active: login.active,
    //         },
    //             'secret', {
    //                 expiresIn: '2h'
    //             }
    //         );
    //         return res.status(200).json({
    //             message: "Success",
    //             token: GlobalToken
    //         });
    //     })
    //     .catch(err=>{
    //         res.send(err)
    //     })
})




//SETUP FOR TWITTER

router.get('/auth/twitter',passport.authenticate('twitter',{
    scope:['profile']
}))

router.get('/auth/twitter/redirect',passport.authenticate('twitter'),(req,res)=>{
    // console.log(req.user)
    //res.json(req.user)
    //const data = req.user
    User.findOne({twitterId:req.user.twitterId})
        .then(login=>{
            //res.json(login)
            if (login.active == 1) {
                GlobalToken = jwt.sign({
                    _id: login._id,
                    twitterId:login.twitterId,
                    username: login.username
                    
                },
                    'secret', {
                        expiresIn: '2h'
                    }
                );
                res.status(200).json({
                    message: "Success",
                    token: GlobalToken
                })
            } else {
                res.status(401).json({
                    message: "Akun Anda belum Diverifikasi"
                })
            }
        })
        .catch(err=>{
            console.log(err)
        })
    
})

//SETUP FOR INSTAGRAM PENDING

router.get('/auth/instagram',passport.authenticate('instagram'));

router.get('/auth/instagram/redirect',
  function(req, res) {
    // Successful authentication, redirect home.
    //res.redirect('/');
    console.log(req)
    console.log(res)
  });



//SETUP FOR FACEBOOK PENDING
router.get('/auth/facebook',passport.authenticate('facebook'));

router.get('/auth/facebook/redirect',passport.authenticate('facebook'),
  function(req, res) {
    // Successful authentication, redirect home.
    console.log(req.user)
    res.json(req.user)
  });


router.get('/auth/logout',(req,res)=>{
    req.logout();
    res.send('logged out')
})


module.exports = router;
