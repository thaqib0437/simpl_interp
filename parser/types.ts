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

export type SExp = Token | SExpNode | BadExpr;

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
    rest: SExp | null;
    constructor(first: SExp, rest: SExp | null){
        this.first = first; 
        this.rest = rest;
    }
}

export class BadExpr{

}