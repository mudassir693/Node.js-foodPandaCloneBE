const router = require('express').Router()
const Order = require('../models/Order')
const {verifyAdminAndUser, verifyAdmin} = require('../middleware/authMiddleware')

// @route POST /api/v1/order/add
// @desc Add Order
// @Access Admin and User
router.post('/add/userId/:id',verifyAdminAndUser,async(req,res)=>{
    const {UserId,Foods,Amount,Status,Address} = req.body
    try {
        const newOrder = new Order({
            UserId,
            Foods,
            Amount,
            Status,
            Address
        })

        const resp = await newOrder.save()
        return res.status(201).json({data:resp,status:201,error:true})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:false})
    }
})

// @route Get /api/v1/order/get
// @desc get Orders
// @Access Admin 
router.get('/get',verifyAdmin,async(req,res)=>{
    try {
        const resp = await Order.find()
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(200).json({data:error,status:201,error:true})
    }
})

// @route Get /api/v1/orderByUser/get
// @desc User Order History
// @Access Admin 
router.get('/getByUser/:id',verifyAdminAndUser,async(req,res)=>{
    try {
        const resp = await Order.aggregate([
         {$match:{UserId:req.params.id}}
        ])
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(200).json({data:error,status:201,error:true})
    }
})

// @route Put /api/v1/update/userId/:id/orderId/:oid
// @desc Update Order
// @Access Admin and User
router.put('/update/userId/:id/orderId/:oid',async(req,res)=>{
    try {
        const date = new Date()
        const order = await Order.findById(req.params.oid)
        const expire = new Date(order.createdAt)
        console.log('Test: ',expire.getTime()+5*60*1000)
        console.log('Test2: ',date.getTime())

        // You can update your order within ten(10) minutes

        if(expire.getTime()+10*60*1000 < date.getTime()){
            return res.status(200).json({data:"Sorry You are Late Now You cannot update your order",status:400,error:true})
        }
        console.log("hello")
        const resp = await Order.findByIdAndUpdate(req.params.oid,{$set:req.body},{new:true})
        return res.status(200).json({data:resp,status:204,error:false}) 
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true}) 
    }
})

// @route Delete /api/v1/order/delete/userId/:id/OrderId/:oid
// @desc Delete order within some time limits
// @Access Admin and User

router.delete('/delete/userId/:id/OrderId/:oid',async(req,res)=>{
    try {
        const date = new Date()
        const order = await Order.findById(req.params.oid)
        const expire = new Date(order.createdAt)
        console.log('Test: ',expire.getTime()+10*60*1000)
        if(expire.getTime()+10*60*1000 < date.getTime()){
            return res.status(200).json({data:"You are not allow to delete it,You are late.",status:200,error:true})
        }

        const resp = await Order.findByIdAndDelete(req.params.oid)
        return res.status(200).json({data:resp,status:200,error:false})

    } catch (error) {
        return res.status(200).json({data:error,status:500,error:true})
    }
})
module.exports = router