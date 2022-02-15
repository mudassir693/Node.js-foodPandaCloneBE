const router = require('express').Router()
const User =require('../models/User')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

// @route  POST api/v1/user/auth/register
// @desc   Add User
// @right  Admin and User itself
router.post('/register',async(req,res)=>{
    try {
        const {Name,Password,Address,PhoneNumber,Email} = req.body

        const isUserAvailable = await User.findOne({PhoneNumber})
        if(isUserAvailable){
            return res.status(400).json({data:'this record is already registered',status: 400,error:false})
        }

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(Password,salt)

        const newUser = new User({
            Name,
            Password:hashedPassword,
            Address,
            PhoneNumber,
            Email
        }) 
        const respUser = await newUser.save()
        return res.status(201).json({data:respUser,status:201,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route  POST api/v1/user/auth/login
// @desc   Add User
// @right  Admin and User itself
router.post('/login',async(req,res) => {
    try {
        const {PhoneNumber, Password} = req.body

        const isUserAvailable = await User.findOne({PhoneNumber})
        if(!isUserAvailable){
            return res.status(400).json({data:'User is not present',status:400,error:true})
        }
        console.log(isUserAvailable);

        const isPasswordMatch = bcrypt.compareSync(Password,isUserAvailable.Password)
        
        if(!isPasswordMatch){
            return res.status(400).json({data:'wrong password',status:400,error:true})
        }
        console.log('testing: ',isPasswordMatch);

        const token = jwt.sign({ 
            id: isUserAvailable._id,
            category:'User',
            AdminTeam: false,
            Role:false,
         }, 'proces.env.JWT_TOKEN');

         return res.status(200).json({data:{user:isUserAvailable,token},status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

module.exports = router