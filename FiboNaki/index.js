const gf = require('./main.js');
const prompt = require('prompt-sync')({sigint: true});
const fn = prompt('Enter Number For FiboNaki = ');
console.log(`Your Number is = ${fn}!`);
gf(fn);