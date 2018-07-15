const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = require("../user/userModel");

const Detail_Personal_InformationSchema = new Schema({
    field_id:{
        type:String
    },
    nama_field:{
        type:String
    },
    tipe_field:{
        type:String
    },
    point:{
        type:Number
    },
    cash:{
        type:Number
    },
    group:{
        type:Number      
    },
    statement:{
        type:String
    },
    col_size:{
        type:Number
    },
    order:{
        type:Number
    },
    begda:{
        type:Date,
        default:Date.now
    },
    endda:{
        type:Date,
        default:Date.now
    }
})


const Detail_Personal_InformationModel = mongoose.model('detail_personal_informations', Detail_Personal_InformationSchema);

module.exports = Detail_Personal_InformationModel;