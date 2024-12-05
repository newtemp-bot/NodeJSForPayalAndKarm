const http = require('http');
let server = http.createServer((req,res)=>{
    res.writeHead(200,{'Content-Type': 'text/plain'});
    res.end("HYY");
});
server.listen(3000);



/* const http = require('http');
let server = http.createServer((req,res)=>{
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end("Hello World!");
})
server.listen(3000); */