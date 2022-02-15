const express = require('express')
const dotenv = require('dotenv')


dotenv.config({path:'./config/.env'})
const app = express()

// connect DB
const ConnectDB = require('./config/MongoConnect')

// basic middleware
app.use(express.json())
app.use(express.urlencoded({extended:false}))

ConnectDB()

app.get('/',(req,res)=>{
    return res.status(200).json({data:"Hey Haider You are ready to nailed FoodPanda",error:false})
})

// routes

app.use('/api/v1/user/auth/',require('./routes/userAuth'))
app.use('/api/v1/user/',require('./routes/user'))
app.use('/api/v1/team/auth/',require('./routes/teamAuth'))
app.use('/api/v1/team/',require('./routes/team'))
app.use('/api/v1/resturants/auth/',require('./routes/resturantAuth'))
app.use('/api/v1/resturants/',require('./routes/resturant'))
app.use('/api/v1/food/',require('./routes/food'))
app.use('/api/v1/cart/',require('./routes/cart'))
app.use('/api/v1/orders/',require('./routes/order'))


const port = process.env.PORT || 5500
app.listen(port,()=>console.log(`server running on port ${port}`))
