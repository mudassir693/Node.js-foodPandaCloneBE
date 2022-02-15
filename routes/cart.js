const router = require('express').Router()
const Cart = require('../models/Cart')
const {verifyAdminAndUser,verifyAdmin} = require('../middleware/authMiddleware')

// @route POST api/v1/cart/add
// @desc Add Cart
// @access resturantOwner or Admin
router.post("/add/:id",verifyAdminAndUser,async(req,res)=>{
    const {UserId,...other} = req.body;
    try {
        const cart = await Cart.findOne({UserId:req.params.id})
        if(cart) {
            const updResp = await Cart.findByIdAndUpdate(cart._id,{$set:other},{new:true})
            return res.status(200).json({data:updResp,status:204,error:false})
        }
        const newCart = new Cart({
            UserId:req.body.UserId,
            Foods:req.body.Foods
        })

        const newResp = await newCart.save()
        return res.status(201).json({data:newResp,status:201,error:false})

    } catch (error) {
        return res.status(500).json({data:error,status:500,error:error})
    }
})

// @route Get /api/v1/cart/get
// @desc Get All Users Cart 
// @Access Admin
router.get('/get',verifyAdmin,async(req,res)=>{
    try {
        const resp = await Cart.find()
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(200).json({data:error,status:500,error:true})
    }
})

// @route Get /api/v1/cart/getByUser/:UserId
// @desc Get Each Users Cart By UserId 
// @Access Admin
router.get('/getByUser/:uid',verifyAdminAndUser,async(req,res)=>{
    try {
        const resp = await Cart.aggregate([
            {$match:{UserId:req.params.uid}}
        ])
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})


// @route Get /api/v1/cart/get/:id
// @desc Get Each Users Cart By CartId 
// @Access Admin
router.get('/get/:id',verifyAdminAndUser,async(req,res)=>{
    try {
        const resp = await Cart.findById(req.params.id)
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:false})
    }
})

// @route Get /api/v1/cart/delet/:id
// @desc Delete Users Cart By CartId 
// @Access Admin
router.delete('/delete/:id',verifyAdmin,async(req,res)=>{
    try {
        const resp = await Cart.findByIdAndDelete(req.params.id)
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})
module.exports = router