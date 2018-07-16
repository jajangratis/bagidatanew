const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const UniqueValidator = require('mongoose-unique-validator')
//require("../../lib/connection")
// const bagidata = mongoose.createConnection('mongodb://192.168.43.84:27017/bagidataswitch');
const ip = require('../../config/ip')
mongoose.connect("mongodb://192.168.88.56:27017/bagidataswitch");

const UserSchema = new Schema({
    username:{
        type:String,
        required:true,
        unique:true
    },
    password:{
        type:String,        
    },
    active:{
        type:Number,
        maxlength:1,
        default:0
    },
    point:{
        type:Number,
        default:0
    },
    cash:{
        type:Number,
        default:0
    },
    verificationkey:{
        type:Number,
        maxlength:6,
        default:111111
    },
    personalInformation:[{
        type:Schema.Types.ObjectId,
        ref:'user_personal_information'
    }],
    googleId:{
        type:String
    },
    twitterId:{
        type:String
    },
    profile_picture:{
        type:String
    }
})

UserSchema.plugin(UniqueValidator)

const UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;