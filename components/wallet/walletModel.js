const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const userModel = require("../user/userModel");
require("../../lib/connection")

const WalletSchema = new Schema({
    user:{
        type:Schema.Types.ObjectId, 
        ref:'users'
    },
    datetime:{
        type:Date,
        default:Date.now
    },
    type:{
        type:String
    },
    amount:{
        type:Number
    },
    drcr:{
        type:String      
    },
    statement:{
        type:String
    }
})


const WalletModel = mongoose.bagidata.model('wallet', WalletSchema);

module.exports = WalletModel;