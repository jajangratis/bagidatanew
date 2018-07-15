const mongoose = require('mongoose');
const Schema = mongoose.Schema;

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