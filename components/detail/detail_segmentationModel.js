const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = require("../user/userModel");
// require("../../lib/connection")
const ip = require('../../config/ip')
mongoose.connect("mongodb://"+ip.hpku+":27017/bagidataswitch");

const Detail_SegmentationSchema = new Schema({
    field_id:{
        type:String
    },
    nama_field:{
        type:String
    },
    tipe_field:{
        type:String
    },
    group:{
        type:Number
    },
    col_size:{
        type:Number
    },
    order:{
        type:Number      
    },
    begda:{
        type:Date,
        default:new Date().toString(),
    },
    endda:{
        type:Date,
        default:new Date().toString()
    },
    min:{
        type:Number
    },
    max:{
        type:Number,
    },
    is_count:{
        type:Number,
        maxlength:4
    }
})


const Detail_SegmentationModel = mongoose.model('detail_segmentations', Detail_SegmentationSchema);

module.exports = Detail_SegmentationModel;