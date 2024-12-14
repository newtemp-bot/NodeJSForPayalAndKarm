const { EventEmitter, errorMonitor } = require("events");
const eventEmitter = new EventEmitter();

eventEmitter.once("run", (number) => {
    console.log("Hello Run This is normal Calledd", number, this);
    setImmediate(() => {
        console.log("this happens asynchronously");
    });
});
eventEmitter.on("run", (number) => {
    console.log("Hello Run This is normal Calledd", number, this);
    setImmediate(() => {
        console.log("this happens asynchronously");
    });
});
/* eventEmitter.once('run',(number)=>{
    console.log("Hello Run This is normal Calledd",number,this);
    setImmediate(() => {
        console.log('this happens asynchronously');
      });
}); */
eventEmitter.on(errorMonitor, (err) => {
    console.log(err);
});

eventEmitter.emit("run", 50);
eventEmitter.emit("run", 50);
//eventEmitter.emit('error', "Sorry This wrong");
eventEmitter.emit("run", 50);

let c = eventEmitter.listenerCount('run');
let d = eventEmitter.listeners('run');

console.log(c);
console.log(d);

