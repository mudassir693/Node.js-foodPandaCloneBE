const jwt = require('jsonwebtoken')

// id: ,
// category: ,
// AdminTeam: ,
// Role: ,

const AuthUser = (req,res,next)=>{
    try {
        const authToken = req.headers.token
        if(authToken){
            const token = authToken.split(' ')[1]
            jwt.verify(token,'proces.env.JWT_TOKEN',(error,result)=>{
                if(error){
                    return res.status(401).json({data:'invalid Token',error:true,status:401})
                }
                req.user = result
                 next()
            })

        }else {
            return res.status(401).json({data:'Token is not present, Un-authenticate',status:401,error:true})
        }
    } catch (error) {
        return res.status(401).json({data:'Token is not present',status:401,error:true})
    }
}

const verifyAdmin = (req,res,next)=>{
    AuthUser(req,res,()=>{
        if(req.user.AdminTeam){
            next()
        }else{
            return res.status(404).json({data:'Just Admin Allow to do that',status:401,error:true})
        }
    })

}

const verifyAdminAndUser = (req,res,next) => {
    AuthUser(req,res,()=>{
        if(req.user.id===req.params.id || req.user.AdminTeam){
            next()
        }else{
            return res.status(400).json({data:'just user and admin can see it',status:400,error:true})
        }
    })
}

const verifyResturent = (req,res,next) => {
    AuthUser(req,res,()=>{
        if(req.user.category=='Resturant' || req.user.AdminTeam){
            next()
        }else{
            return res.status(400).json({data:"Just Resturant owner allow to do that, Thank you.",status:400,error:true})
        }
    })
}

module.exports = {AuthUser,verifyAdmin,verifyAdminAndUser,verifyResturent}