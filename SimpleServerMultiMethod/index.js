const express = require('express');
const path = require('path');
//import express from './node_modules/express';
const app = express();

app.get("/",(req,res,next)=>{
    res.sendFile(path.join(__dirname, '/index.html'));
    //next()
})

app.get("/hello",(req,res,next)=>{
    res.send("Hello");
    console.log("hello is called");
})

app.listen(3000,()=>{
    console.log("Server is Running");
    console.log("Your server available at http://localhost:3000");
})