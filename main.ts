import ParseProgram from './parser/SIMPLparse'; 

// test
console.log(ParseProgram("(vars [(i 100) (j 200)] (while (< i j) (print i) (print j) (set i (+ i 1))))"))