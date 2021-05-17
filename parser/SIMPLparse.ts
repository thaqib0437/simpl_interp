import { Decl, DeclListNode, Program } from "./SIMPLtypes";
import {parseSExp} from './SExpParse/parsesexp';
import { SExp, SExpNode, Token, TokenType } from "./types";
import {keywords} from './keywords';

const doParse = (sexp: SExp): Program | string =>{
    let result: Program | string = null;
    if(!(sexp instanceof SExpNode)){
        return result;
    }
    let lst: SExpNode = sexp;

    let n: number = len(sexp);
    if(n<3){
        return "Expected (vars [(id val)...] stmt...)";
    }
    if(!(lst.first instanceof Token)){
        return "Expected (vars [(id val)...] stmt...), Error: first element is not a token";
    }
    if(lst.first.lexme != "vars"){
        return "Expected (vars [(id val)...] stmt...), Error: first element should be vars";
    }

    let decls: SExp;
    if(lst.rest instanceof SExpNode){
        decls = lst.rest.first;

    }

    if(!(decls instanceof SExpNode)){
        return "Expected (vars [(id val)...] stmt...), Error: list of vars must be a list";
    }


    let declAst: DeclListNode | string = parseDeclseq(decls); // Variable linkedlist.
    

    return null;
}

const parseDeclseq = (lst: SExpNode | SExp): DeclListNode | string =>{
    if(!lst){
        return null;
    }
    
    let decl: SExp; 
    if(lst instanceof SExpNode){
        decl = lst.first;
    }
    if(!(decl instanceof SExpNode) || len(decl) != 2){
        return "Expected (id val)";
    }

    let V: SExp = decl.first; 
    if(!(V instanceof Token) || V.type != TokenType.ID){
        return "Expected (id val), Error: First part of variable must be and ID";
    }
    if(isKeyWord(V.lexme)){
        return `Error: Var name cannot be keyword, given: (${V.lexme} ...)`;
    }

    let VarName: string = V.lexme;
    let val: any; 
    if(decl.rest instanceof SExpNode){
        val = decl.rest.first;
    }

    if(!(val instanceof Token) || val.tokenType != TokenType.NUM){
        return `Value in (id val) must be a number`;
    }

    let declRes: Decl = {var: "", val: 0.0};
    declRes.var = V.lexme;
    declRes.val = parseFloat(val.lexme);
    let rest: DeclListNode | string;

    if(lst instanceof SExpNode){
        rest = parseDeclseq(lst.rest);
    }
    if(typeof rest == 'string'){
        return rest;
    }

    let res: DeclListNode = {decl: declRes, next: rest};
    return res;
}

const isKeyWord = (s: string):boolean => keywords.filter((v)=> v==s).length >= 1;

const len = (f):number => {    
    if(!f){
        return 0; 
    }
    else{
        return 1+len(f.rest);
    }
}

export const ParseProgram = (prog: string):Program | string =>{
    let sexp = parseSExp(prog);
    let p: Program | string = doParse(sexp);
    return p;
}
