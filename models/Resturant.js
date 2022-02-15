const mongoose = require('mongoose')
// const Food = require('../models/Food') 

const ResturantSchema = new mongoose.Schema({
    Name:{
        type: String,
    },
    Password:{
        type:String,
    },
    Address:{
        type:String
    },
    ZipCode:{
        type:String
    },
    PhoneNumber:{
        type:String
    },
    Varified:{
        type:Boolean,
        default:false
    },
    CNIC:{
        type:String
    },
    Foods:Array

},{
    timestamps:true,
})

module.exports = mongoose.model('Resturants',ResturantSchema)