const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = require("../user/userModel");
require('../../lib/connection')

const AccesstokenSchema = new Schema({
    id_user:{
        type:Schema.Types.ObjectId, 
        ref:'users'
    },
    id_social_media:{
        type:Number
    },
    user_id:{
        type:String
    },
    token:{
        type:String
    },
    datetime:{
        type:Date,
        default:Date.now
    },
    token_secret:{
        type:String
    }
})


const AccesstokenModel = mongoose.bagidata.model('access_tokens', AccesstokenSchema);

module.exports = AccesstokenModel;