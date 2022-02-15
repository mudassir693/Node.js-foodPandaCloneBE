const router = require('express').Router();
const Resturants = require('../models/Resturant')
var bcrypt = require('bcryptjs');

// @route  GET api/resturants/get
// @desc   GET Resturants
// @right  All
router.get('/get',async(req,res)=>{
    try {
        const resp = await Resturants.find().lean()
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route  GET api/resturants/get/:id
// @desc   Get each Resturant
// @right  All

router.get('/get/:id',async(req,res)=>{
    try {
        const resp = await Resturants.findById(req.params.id)
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route  PUT api/resturants/update/:id
// @desc   Update each (Number cannot be added) Resturant
// @right  Resturant and Admin
router.put('/update/:id',async(req,res)=>{
    try {

        if(req.body.Password){
            var salt = bcrypt.genSaltSync(10);
            req.body.Password = bcrypt.hashSync(req.body.Password, salt);
        }
        const {PhoneNumber,...others} = req.body
        const resp = await Resturants.findByIdAndUpdate(req.params.id,{$set:others},{new:true});
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route  PUT api/resturants/update/:id
// @desc   Update each (Number cannot be added) Resturant
// @right  Resturant and Admin
router.delete('/delete/:id',async(req,res)=>{
    try {
        const resp = await Resturants.findByIdAndDelete(req.params.id);
        return res.status(202).json({data:"Resturant is deleted sucessfully",status:200,error:true});
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:false});
    }
})
module.exports = router