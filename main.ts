import { type } from 'os';
import ParseProgram from './parser/SIMPLparse'; 
import { Program } from './parser/SIMPLtypes';

// test
let prog: Program | string = ParseProgram("(vars [(i 100) (j 200)] (while (< i j) (print i) (print j) (set i (+ i 1))))");
if(typeof prog == 'string'){
    console.log(prog);
}
else{
    console.dir(prog, {depth: null, colors: true})
}