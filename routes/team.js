const router = require('express').Router();
const Team = require('../models/Team')
const bcrypt = require('bcryptjs')



// @route  PUT api/v1/team/update/:id
// @desc   Update Team Member
// @right  Admin and Team Member itself

router.put('/update/:id',async(req,res)=>{
    try {
        if(req.body.Password){
            const salt = bcrypt.genSaltSync(10)
            req.body.Password = bcrypt.hashSync(req.body.Password,salt)
        }
        const {Email,...others} = req.body
        const respUser = await Team.findByIdAndUpdate(req.params.id,{$set:others},{new:true});
        return res.status(200).json({data:respUser,status:204,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:501,error:true})
    }
})

// @route  DELETE api/v1/team/delete/:id
// @desc   Delete Team Member
// @right  Admin
router.delete('/delete/:id',async(req,res) => {
    try {
        const respUser = await Team.findByIdAndDelete(req.params.id)
        return res.status(203).json({data:respUser,status:203,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route  GET api/v1/team/get
// @desc   GET All Team Member
// @right  Admin and Team Member
router.get('/get',async(req,res)=>{
    try {
        const team = await Team.find()
        return res.status(200).json({data:team,status:200,error:false})
    } catch (error) {
        return res.status(200).json({data:error,status:400,error:true})        
    }
})

// @route  GET api/v1/team/get/:id
// @desc   GET All Team Member
// @right  Admin and Team Member
router.get('/get/:id',async(req,res)=>{
    try {
        const team = await Team.findById(req.params.id)
        return res.status(200).json({data:team,status:200,error:false})
    } catch (error) {
        return res.status(200).json({data:error,status:400,error:true})        
    }
})

module.exports = router