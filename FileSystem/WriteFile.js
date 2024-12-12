const fs = require("fs");
const fsPromies = require("fs").promises;

/* fs.appendFile('demo.txt','Hello How Can I Help',(err)=>{
    if(err) throw err;
    console.log('File Saved..');
}) */

/* fs.open('demo.txt','r',(err,f)=>{
    if (err) throw err;
    console.log(f);
    fs.close(f);
}) */

let str = "Ky Name is Pooja";

/* fs.open('Text.txt','w',(err,fd)=>{
    if (err) throw err;
    console.log(fd);
    fs.write(fd,str,(err,n,str)=>{
        if (err) throw err;
        console.log(n);
        console.log(str);
    });
}) */

/* let data = fs.readFileSync('demo.txt');
console.log(data.toString()); */

let readFunction = () => {
    return fsPromies
        .readFile("Text.txt", { encoding: "utf-8" })
        .then((data) => {
            setTimeout(() => {
                console.log("Pass1");
            }, 1);
            setTimeout(() => {
                console.log("Pass2");
            }, 2);
            setTimeout(() => {
                console.log("Pass3");
            }, 0);
            setTimeout(() => {
                console.log(data);
            }, 3);
        })
        .catch((err) => {
            console.log(err);
        });
};

let TestFunction = async () => {
    console.log("Hello1");
    let fd = await readFunction();
    setTimeout(() => {
        console.log("Hello2");
        console.log("Hello3");
    }, 6);
    console.log("Hello4");
};

TestFunction();
