const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
const userModel = require('./userModel')
//require("../../lib/connection")
require('set-timezone')('Asia/Jakarta')
const ip = require('../../config/ip')
mongoose.connect("mongodb://"+ip.hpku+":27017/bagidataswitch");

const test = new Date()

const UserSegmentationSchema = new Schema({
   user:{
        type:Schema.Types.ObjectId, 
        ref:'users'
   },
   title:{
        type:String,    
   },
   description:{
        type:String
   },
   created_date:{
       type:Date,
       default:new Date().toString(),
   },
   updated_date:{
       type:Date,
       default:new Date().toString()
   },
   status:{
       type:Number,
   },
   is_custom:{
       type:Number,
       maxlength:4
   }

})


const UserSegmentationModel = mongoose.model('user_segmentations', UserSegmentationSchema);

module.exports = UserSegmentationModel;