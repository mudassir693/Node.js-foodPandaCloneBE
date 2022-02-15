const mongoose = require('mongoose')

const FoodSchema = new mongoose.Schema({
    Title:{
        type: String,
    },
    ResturantId:{
        type:String
    },
    Image:{
        type:String,
    },
    Price:{
        type:Number
    },
    DiscountPercent:{
        type:String
    },
    Rating:{
        type:Number,
        default:0
    },
    Description:{
        type:String
    },
    Ingredients:{
        type:String
    }

},{
    timestamps:true,
})

module.exports = mongoose.model('Foods',FoodSchema)