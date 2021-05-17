export enum TokenType {
    LPAREN = "LPAREN", 
    RPAREN = "RPAREN", 
    LBRACK = "LBRACK", 
    RBRACK = "RBRACK", 
    ID = "ID",
    NUM = "NUM", 
    OP = "OP", 
    DONE = "DONE", 
    ERROR = "ERROR"
}

export type SExp = SExpNode | Token | BadExpr;

export class Token{
    tokenType: TokenType;
    lexme: string;
    constructor(type: TokenType, lex: string){
        this.tokenType = type; 
        this.lexme = lex; 
    } 
    get type(){
        return this.tokenType;
    }
}

export class SExpNode{
    first: SExp; 
    rest:  SExp | null;
    constructor(first: SExp, rest: SExp | null | SExpNode){
        this.first = first; 
        this.rest = rest;
    }
}

export class BadExpr{

}