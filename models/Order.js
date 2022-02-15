const mongoose = require('mongoose');


const OrderSchema = new mongoose.Schema({
    UserId:{
        type:String
    },
    Foods:[
        {
        foodId:{
            type:String
            },
        quantity:{
            type:Number
            },
        sellingPrice:{
            type:Number
            }
        }
    ],
    Amount:{
        type:Number
    },
    Status:{
        type:String,
        default:'Pending'
    },
    Address:{
        type:String
    }
    
},{
    timestamps:true
})

module.exports = mongoose.model('Orders', OrderSchema)