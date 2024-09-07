const mongoose=require('mongoose');
require('dotenv').config();
const mongoURL=process.env.MONGODB_URI || 'mongodb://0.0.0.0:27017/voters';

mongoose.connect(mongoURL,{
useNewUrlParser:true,
useUnifiedTopology:true
})

const db=mongoose.connection;

db.on('connected',()=>{
    console.log('Mongodb connected')
})
db.on('disconnected',()=>{
    console.log('Mongodb disconnected')
})
db.on('error',()=>{
    console.log('Error present')
})

module.exports=db;