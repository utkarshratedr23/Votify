const express=require('express');
const app=express();
const db=require('./db');

require('dotenv').config();
const bodyParser=require('body-parser');
app.use(bodyParser.json());

const userRoutes=require('./routes/userRoutes')
app.use('/user',userRoutes);
const candidatesRoutes=require('./routes/candidateRoutes')
app.use('/candidates',candidatesRoutes);

app.listen(8000,()=>{
    console.log('Listening on port 8000');
})