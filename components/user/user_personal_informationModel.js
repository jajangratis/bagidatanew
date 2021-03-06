const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const moment = require('moment')
const userModel = require('./userModel')
const detail_personal_informationsModel = require('../detail/detail_personal_informationModel')
//require("../../lib/connection")
require('set-timezone')('Asia/Jakarta')
const ip = require('../../config/ip')
mongoose.connect("mongodb://"+ip.hpku+":27017/bagidataswitch");

const test = new Date()

const UserPersonalInformationSchema = new Schema({
   field_id:{
        // type:String,
       type:Schema.Types.ObjectId,
       ref:'detail_personal_informations'
   },
   user:{
        type:Schema.Types.ObjectId, 
        ref:'users'
   },
   value:{
        type:String,    
   },
   begda:{
       type:Date,
       default:new Date().toString(),
   },
   endda:{
       type:Date,
       default:new Date().toString()
   }
})


const UserPersonalInformationModel = mongoose.model('user_personal_informations', UserPersonalInformationSchema);

module.exports = UserPersonalInformationModel;