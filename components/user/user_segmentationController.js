const express = require('express');
const UserSegmentation = require('./user_segmentationModel');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/',function(req,res) {
    UserSegmentation.find({})
        .then(getResult=>{
            res.send(getResult)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.post('/add',function(req,res) {
    addSeg = new UserSegmentation({
        user:req.body.user,
        title:req.body.title,
        description:req.body.description,
        created_date:new Date(Date.now),
        updated_date:new Date(Date.now),
        status:req.body.status,
        is_custom:req.body.is_custom
    })
    addSeg.save()
    .then(dataResult=>{
        res.send(dataResult)
    })
    .catch(err=>{
        res.send(err)
    })
})

router.delete('/:id',function (req,res) {
    UserSegmentation.findOneAndRemove({_id:req.params.id})
        .then(delResult=>{
            res.send(delResult)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.patch('/:id',function(req, res){
    UserSegmentation.findOneAndUpdate({_id:req.params.id},req.body).then(function(result){
        UserSegmentation.findOne({_id:req.params.id}).then(function(patchResult){
            res.send(patchResult);
        });
    })
    .catch(err=>{
        res.send(err);
    });
})