import { Program } from "./SIMPLtypes";
import {parseSExp} from './SExpParse/parsesexp';
import { SExp, SExpNode } from "./types";


export const ParseProgram = (prog: string):Program =>{
    let sexp = parseSExp(prog);
    let p: Program;
    return p;
}

const doParse = (sexp: SExp): Program =>{
    let result: Program = null;
    if(!(sexp instanceof SExpNode)){
        return result;
    }
    let lst: SExpNode = sexp;
}