import {interp} from './main';
// test
let p = interp('(vars [(i 100) (j 200) (k 300)]\n\t (while (> i 0) (print i) (set i (divi i 2))) (print i))')        
    .then(v => console.log(v))
    .catch(c => console.log(c));