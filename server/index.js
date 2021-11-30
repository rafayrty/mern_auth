console.log("My first node app");
const express = require('express')

const app = express()
const User = require('./models/user')

const cors = require('cors')

const mongoose = require('mongoose');

mongoose.connect('mongodb://127.0.0.1:27017/first-mern')
 

app.use(cors())
app.use(express.json());

app.post('/api/register', async (req,res)=>{
    console.log(req.body);
    try{

        await User.create({
            name:req.body.name,
            email:req.body.email,
            password:req.body.password
        });

        res.json({status:'ok'})

    } catch(err){
        console.log(err);
        res.json({status:'error',error:'Duplicate Email'})
    }

});



app.post('/api/login', async (req,res)=>{
    

        const user = User.findOne({email:req.body.email,password:req.body.password})
        if(user){
            const token = jwt.sign({
                name:user.name,
                email:req.body.email
            },'secret123')
            return res.json({status:'ok',user:token})
        }else{
            res.json({status:'error',user:false})
        }

});


app.get('/api/quote', async (req,res)=>{
    
    const token = req.headers['x-access-token'];
    
    try{
        const decoded = jwt.verify(token,'secret123');
        const email = decoded.email;
        const user = await User.findOne({email:email})

        return {status:'ok',quote:user.quote};
    } catch(error){
        console.log(error);

        res.json({status:'error',error:'invalid token'})

    }

    if(user){
        const token = jwt.sign({
            name:user.name,
            email:req.body.email
        },'secret123')
        return res.json({status:'ok',user:token})
    }else{
        res.json({status:'error',user:false})
    }

});



app.listen(1337,_=>{
    console.log("server started at http://localhost:1337");
})