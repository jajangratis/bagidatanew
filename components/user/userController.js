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


var fullToken
var GlobalToken 
var getToken

function apiToken(key,secret) {
    var command = "curl -X POST --header 'Content-type:application/x-www-form-urlencoded' --header 'authorization:Basic Q3FSRUdpR2ZxOUROdEhhckRQcnBXdjlYWkFnYTpSNnBxb3pxRldVSEhDMzhBdFdxekFhcXhWZklh' --data 'grant_type=client_credentials' 'https://api.mainapi.net/token' ";
    child = exec(command, function (error, stdout, stderr) {
        const test = JSON.parse(stdout)
        getToken = test.access_token
        console.log(getToken)
    })
}

// apiToken("CqREGiGfq9DNtHarDPrpWv9XZAga","R6pqozqFWUHHC38AtWqzAaqxVfIa");

router.post('/gettoken',function(req,res) {
    var cred = base64.encode("3oj2BGcfQSK56ri8XYHkqY_P374a:ie1GvuNhQXgeJXX6jrVfZl36LG8a")
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

router.get('/verSms/:username',function(req,res) {
    User.findOne({username:req.params.username})
        .then(function(data) {
           if (validator.isEmail(data.username)) {
               res.send('err')
           }else{
            var args = {
                data: { 
                    msisdn : data.username, //Nomor User or id,
                    content: "cek",
                },
                headers: { 
                    "Authorization" : "Bearer d4951e7fd73e99e39c830dd671c4c143",
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Accept":'application/json',
                 }
            };
            client.post("https://api.mainapi.net/smsnotification/1.0.0/messages", args, function (data, response) {
                // parsed response body as js object
                // res.send(fullToken)
                res.send(data);
                // raw response
                // res.send(response);
            });
           }
        })
        .catch(err=>{
            console.log(err)
        })
})

router.post('/login',function(req, res){
    //{$or:[{email:req.body.cek},{no_hp:req.body.cek}]}
    // const test = bcrypt.compare(req.body.password, user.password)
    User.findOne({username:req.body.username}).exec().then(function(user){
        if (user===null) {
            res.status(400).send("username/password Tidak Valid")
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
                        return res.status(200).json({
                            message: "Success",
                            token: GlobalToken,
                            result : jwt.decode(GlobalToken)
                        });
                    } else {
                        res.status(400).json({
                            message: "Akun Anda belum Diverifikasi"
                        })
                    }
                }else{
                    res.status(400).json({
                        message:"Username / Password salah"
                    })
                }
                
            })
        }
    })
    .catch(err=>{
        res.status(400).json({
            message:"ERROROO"
        })
    })
})


router.get('/', function(req, res){
    User.find({}).then(function(results){
        res.send(results);
        
    })
    .catch(err=>{
        res.status(400).send(err)
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
            return res.status(400).json({
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
                .then(function(result) {
                    User.findOne({_id:result._id})
                        .then(function(data) {
                            res.send(data)
                            // res.redirect(307,"http://192.168.88.56:9696/api/user/email/"+cryptr.encrypt(data._id));
                        })
                        .catch(err=>{
                            console.log(err)
                        })
                })
                .catch(err=>{
                    res.status(400).json({
                        message:"Pastikan Email atau nomor telepon Unik"
                    });
                });
            }else{
                res.status(400).send('Harus Berupa Email atau Nomor Telepon')
            }
        }
    })
})

router.get('/verifikasi/email/:username',function(req,res){
    User.findOne({username:req.params.username}).then(function(result){
        if (result === null) {
            return res.status(400).json({
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
                    res.status(400).send({
                        message: "Something Error"
                    })
                })
            }
            if (validator.isNumeric(req.params.username) && (result.username == req.params.username)) {
                //bagian validasi pake nomor hape
                res.send("Verifikasi pake no hp");
            }
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
    if (validator.isEmail(req.body.username)) {
        User.findOne({username:req.body.username})
            .then(
                res.status(200).send("Akun  dapat dipakai")
            )
            .catch(err=>{
                res.status(400).send("akun tidak dapat dipakai")
            })
    }else{
        res.status(400).send("Tolong masukan email")
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
                        html: "<div align='center'><h1 align='center'>Klik Link ini untuk aktivasi akun anda</h1> <br><form action='bagidata:application/user/verifikasi/email/" + data.username + "' target='_blank' > <input type='submit' value='Klik ini '/></form></div>"
                    };
                    // send mail with defined transport object
                    transporter.sendMail(mailOptions, (error, info) => {
                        if (error) {
                            return console.log('err0r');
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

router.get('/email/newpassword/:token',function(req,res) {
    const id = cryptr.decrypt(req.params.token);
    a = User.findOne({username:id});
    if (req.body.new_password==null) {
        req.body.new_password = "testing" 
    }
    bcrypt.hash(req.body.new_password, 10,function(err,hash){
        if (err) {
            res.send(err)
        }else{
            User.update(a,{ $set: { password:hash}},function(response){
                res.send("Password telah diubah silahkan login");
            })
        }
    })
})


router.post('/lupapassword/email',function(req,res) {
    // res.send("req.body.email");
    // res.json({key:req.body.email})||
    User.findOne({username:req.body.username})
        .then(function(result) {  
            a = User.findOne({username:req.body.username});
            if (result===null) {
                res.send("email/No handphone tidak ditemukan")
            }else{
                // console.log(GlobalToken)
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
                        html:
                            "<style>"+ 
                            "<div align='center'>"+
                                "<h1 align='center'>"+
                                    "Klik Link ini untuk mereset password akun anda"+
                                "</h1>"+
                                "<br>"+
                                "<button>"+
                                    "<a href='bagidata://application/lupapassword/"+cryptr.encrypt(result._id)+"'>RESET PASSWORD</a>"+
                                "</button>"+
                                "</div>"
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
            }
        })
        .catch(err=>{
            res.send({
                message:err
            })
        })
})


//Belum Ditambah OR untuk verifikasi no_hp sekaligus
//TODO:NOT COMPLETED
router.post('/lupapassword',function(req,res) {
    // console.log(req.body.email);
    // res.json({key:req.body.email})||
    User.findOne({username:req.body.username})
        .then(function(result) {
            a = User.findOne({username:req.body.username});
            if (result===null) {
                res.send("email/No handphone tidak ditemukan")
            }else{
                if (validator.isEmail(req.body.username)) {
                    bcrypt.hash(req.body.new_password, 10,function(err,hash){
                        if (err) {
                            res.send(err)
                        }else{
                            User.update(a,{ $set: { password:hash}},function(response){
                                res.send("Password telah diubah silahkan login");
                            })
                        }
                    })
                }
                if (validator.isMobilePhone(req.body.username,"any")) {
                    console.log('lupa password mobile')
                }
            }
        })
        .catch(err=>{
            res.send({
                message:err
            })
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
                            res.status(400).send("password lama salah")
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

router.put('/smsotp',function(req,res) {
    axios({
        url:"http://api.mainapi.net/smsotp/1.0.1/otp/key/verifications",
        method:'put',
        headers:{
            authorization:"Bearer"+" "+getToken,
        },
        data:{
            phoneNum:'087868434521',
            digit:6
        }

    })
    .then(function(result) {
        res.send(result)
    })
    .catch(err=>{res.send('err')})
})




module.exports = router;
