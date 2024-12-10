const bf = Buffer.alloc(100);
//const bfstr = new Buffer('Ashok Prajapti');//old do not use this
const bfstr = Buffer.from('Ashok Prajapti','utf-8');
const bfarr = Buffer.from([1,2,3,4]);//new

bf.write("This is the bf For STR.");
let a = bf.toString('utf-8');

console.log(a);
console.log(Buffer.isBuffer(bf));
console.log(bf.length);

bfstr.copy(bf);
const bufferNew = bfstr.slice(0, 5);
const bfConcat = Buffer.concat([bf,bfstr]);
let x = bfConcat.toString('utf-8');

console.log(x);