const router = require('express').Router();
const bcrypt = require('bcryptjs');
var jwt = require('jsonwebtoken');

const Resturants = require('../models/Resturant')

// @route  POST api/v1/resturants/auth/register
// @desc   Add Resturants
// @right  Admin Team
router.post('/register',async(req,res)=>{
    try {
        const {Name,Password, Address, PhoneNumber, Varified, CNIC ,Foods} = req.body

        const isRestAvailable = await Resturants.findOne({PhoneNumber})
        console.log('checkPoint_1: ',isRestAvailable)
        if(isRestAvailable){
            return res.status(200).json({data:"Phone number is already register",status:400,error:true})
        }
        console.log('checkPoint_2: ',isRestAvailable)

        const salt = bcrypt.genSaltSync(10);
        const newHashPassword = bcrypt.hashSync(Password, salt);
        console.log('checkPoint_3: ',isRestAvailable)
        const newResturant = new Resturants({
            Name,
            Password:newHashPassword,
            Address,
            PhoneNumber,
            Varified,
            CNIC,
            Foods
        })

        const resp = await newResturant.save()
        return res.status(201).json({data:resp,status:201,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})   
    }
})


// @route  POST api/v1/resturants/auth/login
// @desc   Login Resturants
// @right  All
router.post('/login',async(req,res)=>{
    try {
        const {PhoneNumber,Password} = req.body

        const respUser = await Resturants.findOne({PhoneNumber})

        const isPasswordMatch = bcrypt.compareSync(Password,respUser.Password)

        if(!isPasswordMatch){
            return res.status(404).json({data:'Wrong Password',status:404,error:true})
        }
        // console.log('Am I reach there?: ', proces.env.JWT_TOKEN);
        const token = jwt.sign({ 
            id: respUser._id,
            category:'Resturant',
            AdminTeam: false,
            Role:false,
         }, 'proces.env.JWT_TOKEN');

        return res.status(200).json({data:{respUser,token},status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})




module.exports = router