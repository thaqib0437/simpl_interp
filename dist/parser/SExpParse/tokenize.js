"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tokenizeProg = void 0;
const scan_1 = require("../scanner/scan");
const splitProg = (prog) => prog.split("");
const tokenizeArr = (progArr) => {
    let res = [];
    let i = 0;
    const n = progArr.length;
    while (i < n) {
        let [T, j] = scan_1.scan(progArr, i);
        res.push(T);
        i = j + 1;
    }
    return res;
};
const tokenizeProg = (prog) => tokenizeArr(splitProg(prog));
exports.tokenizeProg = tokenizeProg;
