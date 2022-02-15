const router = require('express').Router();
const Team = require('../models/Team')
const bcrypt = require('bcryptjs')
var jwt = require('jsonwebtoken');
const {verifyAdmin} = require('../middleware/authMiddleware')

// @route  POST api/v1/team/auth/register
// @desc   Add Team Member
// @right  Admin Team
router.post('/register',verifyAdmin,async(req,res)=>{
    try {
        const {Name, Email, Password, Role} = req.body

        const isAvailable = await Team.findOne({Email})
        if(isAvailable){
            return res.status(400).json({data:'record with this email already present',status:400,error:false})
        }
        console.log(process.env.BcryptSalt);
        console.log(Name);

        const salt = bcrypt.genSaltSync(10)
        const hashedPassword = bcrypt.hashSync(Password, salt)

        const newTeam = new Team({
            Name,
            Email,
            Password: hashedPassword,
            Role
        })

        const respUser = await newTeam.save()
        return res.status(201).json({data:respUser,status:201,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:501,error:true})
    }
})


// @route  POST api/v1/team/auth/login
// @desc   Login Team Member
// @right  All team member 
router.post('/login',async(req,res)=>{
    try {
        const {Email, Password} = req.body

        const respUser = await Team.findOne({Email})
        if(respUser == undefined){
            return res.status(400).json({data:'User is not available',status:400,error:true})
        }

        const isPasswordMatch = bcrypt.compareSync(Password,respUser.Password)
        if(!isPasswordMatch){
            return res.status(400).json({data:"Password doesn't match", status:400,error:true})
        }

        const token = jwt.sign({ 
            id: respUser._id,
            category:'Team',
            AdminTeam: true,
            Role:respUser.Role,
         }, 'proces.env.JWT_TOKEN');

        // const respUser = await newTeam.save()
        return res.status(200).json({data:{respUser,token},status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:501,error:true})
    }
})

module.exports = router