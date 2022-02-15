const router = require('express').Router()
const User = require('../models/User')
const bcrypt = require('bcryptjs')
const {verifyAdmin,verifyAdminAndUser} = require('../middleware/authMiddleware')

// @route  PUT api/v1/user/update/:id
// @desc   Update User
// @right  Admin and User itself

router.put('/update/:id',async(req,res)=>{
    try {
        if(req.body.Password){
            const salt = bcrypt.genSaltSync(10)
            req.body.Password = bcrypt.hashSync(req.body.Password,salt)
        }

        const {PhoneNumber, ...others} = req.body
        
        const updateUser = await User.findByIdAndUpdate(req.params.id,{$set:others},{new:true}) 
        return res.status(200).json({data:updateUser,status:204,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})


// @route  GET api/v1/user/get
// @desc   Get All User
// @right  Admin
router.get('/get',verifyAdmin,async(req,res)=>{
    try {
        const resp = await User.find()
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route  GET api/v1/user/get/:id
// @desc   Get Each User
// @right  Admin and User Itself
router.get('/get/:id',verifyAdminAndUser,async(req,res)=>{
    try {
        const resp = await User.findById(req.params.id)
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route  DELETE api/v1/user/delete/:id
// @desc   delete Each User
// @right  Admin and User Itself
router.delete('/delete/:id',verifyAdminAndUser,async(req,res)=>{
    try {
        const resp = await User.findByIdAndDelete(req.params.id)
        return res.status(200).json({data:resp,status:200,error:true})
    } catch (error) {
        return res.status(500).json({data:error,status:400,error:true})
    }
})


module.exports = router