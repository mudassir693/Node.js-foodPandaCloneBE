const mongoose = require('mongoose')

const TeamSchema = new mongoose.Schema({
    Name:{
        type:String,
    },
    Email:{
        type:String,
        required:true,
    },
    Password:{
        type:String,
    },
    Role:{
        type:String,
        default:'Admin'
    }
})

module.exports = mongoose.model('Team',TeamSchema);