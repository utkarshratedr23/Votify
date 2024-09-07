const express=require('express');
const router=express.Router();
const User = require('./../models/user');
const { generateToken,jwtAuthMiddleware } = require('./../jwt');

router.post('/signup',async(req,res)=>{
    try{
        const data=req.body;
       const newUser=new User(data);
       const response=await newUser.save();
       console.log('data saved')
       const payload={
        id:response.id,
       }
       console.log(JSON.stringify(payload))
       const token=generateToken(payload)
       console.log("Token is:",token)
       res.status(200).json({response:response,token:token})
    }
    catch(err){
    console.log('Found error');
    res.status(500).json({error:'Internal servor error'})
    }
   
    })
router.post('/login',async (req,res)=>{
    try{
    const {aadharCardNumber,password}=req.body;
    const user=await User.findOne({aadharCardNumber:aadharCardNumber,password:password})
    if(!user || !(await user.comparePassword(password))){
        return res.status(404).json({error:'Invalid username or password'})
    }
    //generate token
    const payload={
        id:user.id,
        username:user.username
    }
    const token=generateToken(payload)
    //return a response
    res.json({token})
    }
    catch(err){
    res.status(500).json({error:"Internal server error"})
    }
})    
router.get('/',async(req,res)=>{
    try{
    const data=await User.find();
    res.status(200).json({data:data})
    }
    catch(err){
        res.status(500).json({error:"Internal server error"})
    }
})
router.get('/profile',jwtAuthMiddleware,async(req,res)=>{
   try{
    const userData=req.user;
    const userId=userData.id;
    const user=await User.findById(userId);
    console.log('WE got profile')
    res.status(2000).json({user});
    
   }
   catch(err){
   console.log('Error found')
   res.status(500).json({error:'Error'});
   }
    })
  router.put('/profile/password',async(req,res)=>{
    try{
  const userId=req.user;
  const {currentPassword,newPassword}=req.body;
  const user=await User.findById(userId);
  if(!(await user.comparePassword(currentPassword))){
    return res.status(401).json({error:'Invalid username or password'})
  }
  user.password=newPassword;
  await user.save();
}
    catch(err){
        res.status(404).json({error:'Server Error'})
    }
  })
module.exports=router;