const express = require("express");
const app = express();
const PORT = 3000;

const path = require('path')
app.use('/static', express.static(path.join(__dirname, '/src/images/Couples.jpg')));

app.get('/file', (req, res)=>{
    res.sendFile(path.join(__dirname,'/src/images/Couples.jpg'));
});

/* app.use(express.json());
app.post('/', (req, res)=>{
    const {name} = req.body;
    
    res.send(`Welcome ${name}`);
})
 */
/* app.get('/', (req, res)=>{
    res.status(200);
    res.send("Welcome to root <a href='/hello'>Hello</a> URL of Server");
}); */

app.get('/hello', (req, res)=>{
    res.set('Content-Type', 'text/html');
    res.status(200).send("<h1>Hello GFG Learner!</h1>");
});


app.listen(PORT, (error) => {
    if (!error)
        console.log(
            `Server is Successfully Running, and App is listening on port ${PORT}
            click To Go http://localhost:3000/
            `
        );
    else console.log(`Error occurred, server can't start ${error}`);
});
