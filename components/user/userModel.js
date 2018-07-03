const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
    },
    password:{
        type:String,
        required:true,
    },
    nama:{
        type:String,
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    no_hp:{
        type:String,
        
    },
    active:{
        type:Number,
        maxlength:1,
        default:0
    }
})


const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;