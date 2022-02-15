const mongoose = require('mongoose');


const CartSchema = new mongoose.Schema({
    UserId:{
        type:String
    },
    Foods:Array
    
})

module.exports = mongoose.model('Carts', CartSchema)