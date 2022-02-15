const mongoose = require('mongoose')

const UserSchema =new mongoose.Schema({
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
    Email:{
        type:String
    },
},{
    timestamps:true,
})

module.exports = mongoose.model('Users',UserSchema)