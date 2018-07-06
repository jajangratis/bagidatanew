const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,
        required:true
    },
    active:{
        type:Number,
        maxlength:1,
        default:0
    }
})


const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;