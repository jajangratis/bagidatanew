const express = require('express');
const Detail_Segmentation = require('./detail_segmentationModel');
const router = express.Router();
const jwt = require('jsonwebtoken');

router.get('/',function(req,res) {
    Detail_Segmentation.find({})
        .then(getResult=>{
            res.send(getResult)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.post('/add',function(req,res) {
    addRow = new Detail_Segmentation({
        field_id:req.body.field_id,
        nama_field:req.body.nama_field,
        tipe_field:req.body.tipe_field,
        group:req.body.group,
        col_size:req.body.col_size,
        order:req.body.order,
        endda:new Date("2200-12-12"),
        min:req.body.min,
        max:req.body.max,
        is_count:req.body.is_count
    })
    addRow.save()
    .then(rowResult=>{
        res.send(rowResult)
    })
    .catch(err=>{
        res.send(err)
    })
})

router.delete('/:id',function (req,res) {
    Detail_Segmentation.findOneAndRemove({_id:req.params.id})
        .then(delResult=>{
            res.send(delResult)
        })
        .catch(err=>{
            res.send(err)
        })
})

router.patch('/:id',function(req, res){
    Detail_Segmentation.findOneAndUpdate({_id:req.params.id},req.body).then(function(result){
        Detail_Segmentation.findOne({_id:req.params.id}).then(function(patchResult){
            res.send(patchResult);
        });
    })
    .catch(err=>{
        res.send(err);
    });
})