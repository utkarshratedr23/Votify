const express=require('express');
const router=express.Router();
const Candidate = require('./../models/candidate')
const User=require('./../models/user')
const {jwtAuthMiddleware } = require('./../jwt');

const checkAdminRole=async(userId)=>{
    try{
  const user=await User.findById(userId);
    return user.role==='admin'
    }
    catch(err){
        return false;
    }
}
router.get('/',jwtAuthMiddleware,async(req,res)=>{
    try{
     const data=await Candidate.find();
     res.status(200).json(data);
    }
    catch(err){
     console.log('No content was found')
     res.status(500).json({error:'Internal servor error'})
    }
})
router.post('/',jwtAuthMiddleware,async(req,res)=>{
    try{
    if(! await checkAdminRole(req.user.id)){
        console.log('Admin not found')
        res.status(404).json({error:'User does not have admin role'})
    }
    else{
      console.log('User is admin')
    }
    const candidate=req.body;
    const newCandidate=new Candidate(candidate);
    const response=await newCandidate.save();
    console.log('data saved')
    res.status(200).json({response});
    }
    catch(err){
   res.status(500).json({error:'Server error'})
    }
})
router.post('/signup',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(! await checkAdminRole(req.user.id)){
            console.log('Admin role not found')
            return res.status(403).json({message:'User has not admin role'})
        }
      else{
        console.log('Admin role found')
      }
        const data=req.body;
       const newCandidate=new Candidate(data);
       const response=await newCandidate.save();
       console.log('data saved')
       res.status(200).json({response:response})
    }
    catch(err){
    console.log('Found error');
    res.status(500).json({error:'Internal servor error'})
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

  router.put('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
    if(! await checkAdminRole(req.user.id))
        return res.status(403).json({error:'User is not an admin'})
    else
    console.log('User is admin')

  const candidateId=req.params.candidateID;//extract the user id from url
  const updatedCandidateData=req.body;//updated data for candidate
  const response=await Candidate.findByIdAndUpdate(candidateId,updatedCandidateData
,{
    new:true,
    runValidators:true
}
)
if(!response){
    return res.status(404).json({error:'Candidate not found'})
}
console.log('Candidate data updated');
res.status(200).json(response)
}
    catch(err){
        res.status(404).json({error:'Server Error'})
    }
  })


  router.delete('/:candidateID',jwtAuthMiddleware,async(req,res)=>{
    try{
        if(!await checkAdminRole(req.user.id))
     return res.status(403).json({error:'Admin is not found'})
    else
    console.log('Admin is found')

     const CandidateId=req.params.candidateID;
     const data=await Candidate.findByIdAndDelete(CandidateId);
     if(!data){
        return res.status(404).json({error:'Failed to delete Candidate'})
     }
     
     console.log('candidate deleted')
     return res.status(200).json({data:data});

    }
    catch(err){
        return res.status(500).json({error:"Internal server error"})
    }
  })
   /* router.delete('/:id', jwtAuthMiddleware, async (req, res) => {
        try {
            // Check if the user has admin privileges
            if (!await checkAdminRole(req.user.id)) {
                return res.status(403).json({ error: 'Admin is not found' });
            }
            console.log('Admin is found');
    
            const candidateId = req.params.id; // Get candidate ID from request params
    
            // Find the candidate by ID and delete it
            const data = await Candidate.findByIdAndDelete(candidateId);
            if (!data) {
                return res.status(404).json({ error: 'Candidate not found, deletion failed' });
            }
    
            console.log('Candidate deleted');
            return res.status(200).json({ message: 'Candidate successfully deleted', data: data });
            
        } catch (err) {
            console.error('Error during candidate deletion:', err);
            return res.status(500).json({ error: "Internal server error" });
        }
    });*/
    //Voting
   /* router.post('/vote/:candidateID',jwtAuthMiddleware,async(req,res)=>{
       userId= req.user.id;
     candidateID=req.params.candidateID;
     try{
      const user=await User.findById(userId);
      if(!user){
        res.status(404).json({message:"User not found"});
      }
      const candidate=await Candidate.findById(candidateID);
      if(!candidate){
        console.log('Candidate not found');
        res.status(404).json({message:'Candidate not found'})
      }
      if(user.isVoted){
        console.log('You have already voted')
        res.status(400).json({message:"You have already voted"})
      }
      if(user.role=='admin'){
        res.status(403).json({messagge:'User is not allowed'})
      }
      // Update the candidate document to record the vote
      candidate.votes.push({user:userId});
      candidate.votedCount++;
      await candidate.save();
      //update the user document
      user.isVoted=true
      await user.save();
      res.status(200).json({message:'Vote recorded sucessfully'})
     }
     catch(err){
        console.log('error');
        return res.status(500).json({error:"Internal server error"})
     }
    })*/
     router.get('/vote/:candidateID', jwtAuthMiddleware, async (req, res)=>{
        // no admin can vote
        // user can only vote once
        
     let  candidateID = req.params.candidateID;
      let userId = req.user.id;
    
        try{
            // Find the Candidate document with the specified candidateID
            const candidate = await Candidate.findById(candidateID);
            if(!candidate){
                return res.status(404).json({ message: 'Candidate not found' });
            }
    
            const user = await User.findById(userId);
            if(!user){
                return res.status(404).json({ message: 'user not found' });
            }
            if(user.role == 'admin'){
                return res.status(403).json({ message: 'admin is not allowed'});
            }
            if(user.isVoted){
                return res.status(400).json({ message: 'You have already voted' });
            }
    
            // Update the Candidate document to record the vote
            candidate.votes.push({user:userId})
            candidate.votedCount++;
            await candidate.save();
    
            // update the user document
            user.isVoted = true
            await user.save();
    
            return res.status(200).json({ message: 'Vote recorded successfully' });
        }catch(err){
            console.log(err);
            return res.status(500).json({error: 'Internal Server Error'});
        }
    });
    //Votes count
    router.get('/vote/count',async(req,res)=>{
        try{
        //find all candidates and sort them by votecount
        const candidate=await Candidate.find().sort({votedCount:'desc'})
        //find all candidates to only return their name and votescount
        const voterecord=candidate.map((data)=>{
            return{
                party:data.party,
                count:data.votedCount
            }
        })
        res.status(200).json(voterecord)
        }
        catch(err){
            console.log(err);
            return res.status(500).json({error:"Internal server error"})
        }
    })
module.exports=router;