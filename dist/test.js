"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const main_1 = require("./main");
// test
let p = main_1.interp('(vars [(i 100) (j 200) (k 300)] (while (> i 0) (print i) (set i (divi i 2))) (print i))')
    .then(v => console.log(v))
    .catch(c => console.log(c));
