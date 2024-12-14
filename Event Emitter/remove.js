let emitter = require('events');
let em = new emitter();

let dataOptions = {
    datalimit:6,
    datacount:0
}

let datalistener = () =>{
    console.log("Data occured..");
    dataOptions.datacount++;
}

em.on('data',datalistener);

let clearInter =  setInterval(()=>{
    if (dataOptions.datacount==dataOptions.datalimit) {
        em.removeListener('data',datalistener);
        clearInterval(clearInter);
    }
    em.emit('data');
},1000)

/* setTimeout(()=>{
    em.removeListener('data',datalistener);
},4000); */


//on
//once
//emit
//removeListener