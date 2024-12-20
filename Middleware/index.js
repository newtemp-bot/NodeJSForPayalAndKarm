const express = require("express");
const app = express();

const port = 3000;

app.use(express.urlencoded({extended:true}));

app.use((req,res,next)=>{
    console.dir(req.body);
    console.log(`Middleware1`);
    next();
});
app.use((req,res,next)=>{
    console.dir(req.body);
    console.log(`Middleware2`);
    next();
});

app.get("/", (req, res) => {
    res.status(201);
    res.json(req.body);
});

app.listen(port, () => {
    console.log(`Listening to port ${port}`);
});