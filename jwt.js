const jwt=require('jsonwebtoken');
require('dotenv').config();
const jwtAuthMiddleware=(req,res,next)=>{
    const token=req.headers.authorization.split(' ')[1];
    if(!token) return res.status(401).json({error:'Unauthorized'})
    try{
    //Verify jwt token
    const decoded=jwt.verify(token,process.env.JWT_SECRET)
    //Attach user information to the request object
    req.user=decoded
    next();
    }
    catch(err){
   console.error(err);
   res.status(401).json({error:'Invalid Token'})
    }
}
const generateToken=(userdata)=>{
    return jwt.sign(userdata,process.env.JWT_SECRET,{expiresIn:30000})
}
module.exports={jwtAuthMiddleware,generateToken}