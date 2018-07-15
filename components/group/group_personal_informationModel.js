const mongoose = require('mongoose');
const Schema = mongoose.Schema;
//require("../../lib/connection")
const ip = require('../../config/ip')
mongoose.connect("mongodb://"+ip.hpku+":27017/bagidataswitch");

const Group_Personal_InformationSchema = new Schema({
    nama_group:{
        type:String
    },
    order:{
        type:Number
    }
})


const Group_Personal_InformationModel = mongoose.model('group_personal_information', Group_Personal_InformationSchema);

module.exports = Group_Personal_InformationModel;