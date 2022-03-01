const router = require('express').Router()
const {verifyAdmin,verifyResturent} = require('../middleware/authMiddleware')
const Food = require('../models/Food')
const eClient = require('../config/ElasticSearchConfig')


// @route POST api/v1/food/add
// @desc Add Food
// @access Resturant and Team Member

router.post('/add',verifyResturent,async(req,res)=>{
    try {
        const {Title,ResturantId,Image,Price,DiscountPercent,Rating,Description,Ingredients} = req.body
        const isFoodAvailableFromSameResturant = await Food.find({ResturantId})
        const test = isFoodAvailableFromSameResturant.find(eachObj=> eachObj.Title==Title)
        if(test){
            return res.status(400).json({data:"Product with the same name is Already Available from The Same resurant",status:400,error:true})
        }
        const newFood = new Food({
            Title,
            ResturantId,
            Image,
            Price,
            DiscountPercent,
            Rating,
            Description,
            Ingredients
        })
        const resp = await newFood.save()

        const resp2 = await eClient.index({
            index: 'foodpanda-foods',
            document: {
                id: resp._id,
                title: Title
            }
        }) 

        // console.log(resp2)
        return res.status(201).json({data:resp,status:201,error:false})
    } catch (error) {
        console.log(error)
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route GET api/v1/food/getAll
// @desc GET All Foods
// @access All
router.get('/getFromESearch/:word',async(req,res)=>{
    try {
       const resp = await eClient.search({
            index:'foodpanda-foods',
            query:{
                wildcard:{
                    'title.keyword':`*${req.params.word}*`
                }
            }
        }
        )

        return res.status(200).json({data:resp.hits.hits,status:200,error:false})
    } catch (error) {
        return res.status(200).json({data:error,status:500,error:true})
    }
})

// @route GET api/v1/food/getAll
// @desc GET All Foods
// @access All
router.get('/getAll',async(req,res)=>{
    try {
        const resp = await Food.find()
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route GET api/v1/food/getByResturant/:id
// @desc GET All Foods
// @access All
router.get('/getByRestirant/:id',async(req,res)=>{
    try {
        const resp = await Food.aggregate([
            {$match:{ResturantId:req.params.id}}
        ])
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(500).json({data:error,status:500,error:true})
    }
})

// @route PUT api/v1/food/update/:id
// @desc Update Foods
// @access resturantOwner or Admin
router.put('/update/:pid',verifyResturent,async(req,res)=>{
    try {
        const isFoodAvailable = await Food.find({$and:[{Title:req.body.Title},{ResturantId:req.body.ResturantId}]})
        if(isFoodAvailable.length>0){
            console.log(isFoodAvailable)
            return res.status(400).json({data:'food with this title is alreay register from your resturant',status:400,error:true})
        }
        const resp = await Food.findByIdAndUpdate(req.params.pid,{$set:req.body},{new:true})
        return res.status(200).json({data:resp,status:204,error:false})
    } catch (error) {
        return res.status(200).json({data:error,status:500,error:true})
    }
})


// @route DELETE api/v1/food/delete/:id
// @desc Remove Foods
// @access resturantOwner or Admin
router.delete('/delete/:pid',verifyResturent,async(req,res)=>{
    try {
        const resp = await Food.findByIdAndRemove(req.params.pid)
        return res.status(200).json({data:resp,status:200,error:false})
    } catch (error) {
        return res.status(200).json({data:error,status:500,error:true})
    }
})
module.exports = router