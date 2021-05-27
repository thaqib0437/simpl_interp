import { AEAST, AEBin, AEId, AENum, Decl, DeclListNode, Program, Seq, Skip, StmtAST, Set, Print, BELit, BEAnd, BEAST, BENot, BEOr, BECompare, Iif, While } from "./SIMPLtypes";
import {parseSExp} from './SExpParse/parsesexp';
import { BadExpr, SExp, SExpNode, Token, TokenType } from "./types";
import {compOP, keywords, OP} from './keywords';

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


    let declAst: DeclListNode | string = parseDeclseq(decls); 
    
    if(typeof declAst == 'string'){
        return declAst;
    }

    let stmt: StmtAST | string = parseSeq((lst.rest instanceof SExpNode)?(lst.rest.rest):null);
    if(typeof stmt == 'string'){
        return stmt;
    }
    return new Program(true, decls, stmt);
}

const parseSeq = (lst: SExp): StmtAST | string => {

    if(lst == null){
        return "Program cannot be empty";
    }
    const n = len(lst); 
    if(n==1){
        return parseStmt((lst instanceof SExpNode)?lst.first:null);
    }

    let stmt1 = (lst instanceof SExpNode)?parseStmt(lst.first):"BadExpr";
    if(typeof stmt1 == 'string'){
        return stmt1;
    }
    
    let stmt2 = (lst instanceof SExpNode)?parseSeq(lst.rest):"BadExpr";
    if(typeof stmt2 == 'string'){
        return stmt2;
    }
    return new Seq(stmt1, stmt2); 
}

const parseStmt = (sexp:SExp): StmtAST | string =>{
    if(sexp instanceof Token){
        return "Bad expression";
    }
    let lst: SExpNode;
    if(sexp instanceof SExpNode){
        lst = sexp;
    }
    let n = len(lst);
    if(!n){
        return "Empty Statement";
    }

    let first: SExp = lst.first;
    if(!(first instanceof Token)){
        return "Statement Cannot be a list";
    }

    let t: Token = first;
    if(t.type != TokenType.ID){
        return "Statement must begin with a key word. "
    }

    if(t.lexme === "skip"){
        if(n!=1){
            return "Skip takes no args";
        }
        return new Skip(); 
    }
    if(t.lexme === "seq"){
        if(n!=3){
            return "Seq takes 2 args";
        }
        let stmt1 = (lst.rest instanceof SExpNode)?parseStmt(lst.rest.first):"x";
        if(typeof stmt1 == 'string'){
            return stmt1;
        }

        let stmt2 = (lst.rest instanceof SExpNode)?
                    (lst.rest.rest instanceof SExpNode)?
                    parseStmt(lst.rest.rest.first):"x":"x";
        if(typeof stmt2 == 'string'){
            return stmt2;
        }
        return new Seq(stmt1, stmt2);
    }
    if (t.lexme === "set"){
        if(n!=3){
            return "Set takes 2 args. (set var expr)";
        }
        let second = (lst.rest instanceof SExpNode)? lst.rest.first : "X";
        if(!(second instanceof Token)){
            return "First argumet of set must be an ID. (set ID expr)";
        }
        if(second.tokenType != TokenType.ID){
            return "First argumet of set must be an ID. (set ID expr)";
        }

        if(isKeyWord(second.lexme)){
            return `Variable stmt cannot be a key word. Given: (set ${second.lexme} ...)`;
        }

        let expr =  (lst.rest instanceof SExpNode)?
                    (lst.rest.rest instanceof SExpNode)?
                    parseAE(lst.rest.rest.first):"x":"x";
        if(typeof expr == 'string'){
            return expr;
        } 
        return new Set(second.lexme, expr);
    }
    if(t.lexme === "print"){
        if(n!=2){
            return "print takes one argument";
        }
        let expr = (lst.rest instanceof SExpNode)?parseAE(lst.rest.first):"x";
        if(typeof expr == 'string'){
            return expr;
        }
        return new Print(expr);
    }
    if(t.lexme === "iif"){
        if(n!=4){
            return "iif takes 3 arguments";
        }
        let test = (lst.rest instanceof SExpNode)?parseBE(lst.rest.first):"BadIif";
        if(typeof test == 'string'){
            return test;
        }
        let tstmt = (lst.rest instanceof SExpNode)?
                    (lst.rest.rest instanceof SExpNode)?
                    parseStmt(lst.rest.rest.first):"BadIif":"BadIif";
        if(typeof tstmt == 'string'){
            return tstmt;
        }
        let fstmt = (lst.rest instanceof SExpNode)?
                    (lst.rest.rest instanceof SExpNode)?
                    (lst.rest.rest.rest instanceof SExpNode)?
                    parseStmt(lst.rest.rest.rest.first):"BadIif":"BadIif":"BadIif";
        if(typeof fstmt == 'string'){
            return fstmt;
        }
        return new Iif(test, tstmt, fstmt);
    }
    if(t.lexme == "while"){
        if(n<3){
            return "while takes a test and a body. (while (tst) body ...)"
        }
        let tst = (lst.rest instanceof SExpNode)?parseBE(lst.rest.first):"BadWhile";
        if(typeof tst == 'string'){
            return tst;
        }

        let body = (lst.rest instanceof SExpNode)?parseSeq(lst.rest.rest):"BadWhile";
        if(typeof body == 'string'){
            return body; 
        }
        return new While(tst, body);
    }
    else {
        return `Statement must begin with a key word. ${keywords}`;
    }
}

const parseBE = (sexp: SExp) : BEAST | string =>{
    if(sexp instanceof BadExpr){
        return "BadExpr";
    }
    if(sexp instanceof Token){
        let t = sexp;
        if(t.lexme != "true" && t.lexme != "false"){
            return `Invalid Boolean literal ${t.lexme}`;
        }
        return new BELit((t.lexme=="true")?true:false);
    }
    else if (sexp instanceof SExpNode){
        let lst = sexp;
        let n = len(lst);
        if(n<2){
            return "Bad Boolean Expression";
        }
        let first = lst.first;
        if(!(first instanceof Token)){
            return "BExp must begin with an operator";
        }
        let op = first;
        if(op.lexme === "not"){
            if(n!=2){
                return "not requires one argument. (not bexpr)"
            }
            let operand = (lst.rest instanceof SExpNode)?lst.rest.first:"x";
            let arg = parseBE(operand);
            if(typeof arg == 'string'){
                return arg;
            }
            return new BENot(arg);
        }
        if(op.lexme === "and"){
            return (lst.rest instanceof SExpNode)?parseAnd(lst.rest):"Badexpr";
        }
        if(op.lexme === "or"){
            return (lst.rest instanceof SExpNode)?parseOR(lst.rest):"Badexpr";
        }
        else if(iscompOp(op.lexme)){
            if(n!=3){
                return "CompareOP requires 2 arguments";
            }
            let arg1 =(lst.rest instanceof SExpNode)?parseAE(lst.rest.first):"BadExpr";
            if(typeof arg1 == 'string'){
                return arg1;
            }
            let arg2 = (lst.rest instanceof SExpNode)?
                        (lst.rest.rest instanceof SExpNode)?
                        parseAE(lst.rest.rest.first):"BadExpr":"BadExpr";
            if(typeof arg2 == 'string'){return arg2;}
            return new BECompare(op.lexme, arg1, arg2);
        }
        else {
            return "Invalid Boolean Operator";
        }
    }
}
const parseAnd = (sexp: SExpNode): BEAST | string =>{
    let n = len(sexp);
    if(n==0){
        return new BELit(true);
    }
    else if (n==1){
        return parseBE(sexp.first);
    }
    else{
        let rest = (sexp.rest instanceof SExpNode)?parseAnd(sexp.rest):"BadExpr";
        if(typeof rest == 'string'){
            return rest;
        }
        let first = parseBE(sexp.first);
        if(typeof first == 'string'){
            return first;
        }
        return new BEAnd(first, rest);
    }
}

const parseOR = (lst: SExpNode): BEAST | string => {
    let n = len(lst);
    if(n==0){
        return new BELit(false);
    }
    else if(n==1){
        return parseBE(lst.first);
    }
    else {
        let rest = (lst.rest instanceof SExpNode)? parseOR(lst.rest):"BadExpr";
        if(typeof rest == 'string'){
            return rest;
        }
        let first = parseBE(lst.first);
        if(typeof first == 'string'){
            return first;
        }
        return new BEOr(first, rest);
    }
}

const parseAE = (sexp: SExp):AEAST | string => {    
    if(sexp instanceof BadExpr){
        return "BadExpr";
    }
    if(sexp instanceof Token){
        let t = sexp;
        if(t.tokenType == TokenType.ID){
            return new AEId(t.lexme);
        }
        else if(t.tokenType == TokenType.NUM){
            let val = parseFloat(t.lexme);
            return new AENum(val);
        }
        else {
            return "BadExpr";
        }
    }
    else if (sexp instanceof SExpNode){
        let lst = sexp;
        if(len(lst) != 3){
            return "Incorrect Binary arithmetic expr";
        }
        let op, first, second, third;
        first = (lst.first);
        second = (lst.rest instanceof SExpNode)? lst.rest.first : "x"; 
        third = (lst.rest instanceof SExpNode)?
                (lst.rest.rest instanceof SExpNode)? lst.rest.rest.first : "X" : "X";
        if(!(first instanceof Token)){
            return "AExp must begin with an operator.";
        }
        let operator = first;
        if(!isOp(operator.lexme)){
            return "Operator must be +, - , div, *, or mod";
        }

        op = operator.lexme;
        if(op == "div"){ op = "/"}
        if(op == "mod"){op = "%"}
        
        let arg1 = parseAE(second);
        if(typeof arg1 == 'string'){
            return arg1;
        }
        let arg2 = parseAE(third);
        if(typeof arg2 == 'string'){
            return arg2;
        }
        return new AEBin(op, arg1, arg2);
    }
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
const isOp = (s: string):boolean => OP.filter((v) => v==s).length >=1;
const iscompOp = (s: string):boolean => compOP.filter((v) => v==s).length >=1;

const len = (f):number => {    
    if(!f){
        return 0; 
    }
    else{
        return 1+len(f.rest);
    }
}

const ParseProgram = (prog: string):Program | string =>{
    let sexp = parseSExp(prog);
    let p: Program | string = doParse(sexp);
    return p;
}


export default ParseProgram;