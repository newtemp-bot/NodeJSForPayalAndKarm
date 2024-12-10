const http = require("http");
const fs = require("fs");

let server = http.createServer((req, res) => {
    fs.readFile("demo.txt", (err, data) => {
        if (!err) {
            res.writeHead(200, { "Content-Type": "text/html" });
            res.write(data);
            return res.end();
        } else {
            console.log("Something went Wrong.");
            res.end(`Something went Wrong.... ${err}`);

            // Signal the server to stop accepting new connections
            server.close(() => {
                console.log("Server closed");
                process.exit(0); // Optional: Exit the process
            });
        }
    });
});

server.listen(3000, () => {
    console.log("Server is Running");
    console.log("Your server available at http://localhost:3000");
});
