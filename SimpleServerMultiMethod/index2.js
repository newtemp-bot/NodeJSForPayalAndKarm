// Importing the http module
debugger;
const http = require("http")

// Creating server 
const server = http.createServer((req, res) => {
    debugger;
    // Sending the response
    res.write("This is the response from the server")
    res.end();
})

// Server listening to port 3000
server.listen((3000), () => {
    console.log("Server is Running");
})