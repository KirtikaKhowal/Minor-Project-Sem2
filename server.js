/*
1) mkdir backend
2) npm init -y
3) npm install express mongoose jsonwebtoken cors bcryptjs
4) node server.js
*/

const express=require('express');
const mongoose=require('mongoose');
const jwt=require('jsonwebtoken');
const bcrypt=require('bcryptjs');
const app=express();
app.use(express.json());

mongoose.connect('mongodb://127.0.0.1/studentApp');

const User=mongoose.model('User',{email:String,password:String});
const Task=mongoose.model('Task',{user:String,task:String,subject:String,deadline:String});

app.post('/signup',async(req,res)=>{const hash=await bcrypt.hash(req.body.password,10);await User.create({email:req.body.email,password:hash});res.send('ok')});
app.post('/login',async(req,res)=>{const u=await User.findOne({email:req.body.email});if(!u||!await bcrypt.compare(req.body.password,u.password))return res.sendStatus(401);res.json({token:jwt.sign({id:u._id},'secret')})});

app.post('/task',async(req,res)=>{const user=jwt.verify(req.headers.authorization,'secret');await Task.create({user:user.id,...req.body});res.send('saved')});

app.listen(3000,()=>console.log('Server running'));


// MongoDB (Compass)
// Database: studentApp
// Collections: users, tasks


