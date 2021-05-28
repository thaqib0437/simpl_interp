export declare enum TokenType {
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
export declare type SExp = SExpNode | Token | BadExpr;
export declare class Token {
    tokenType: TokenType;
    lexme: string;
    constructor(type: TokenType, lex: string);
    get type(): TokenType;
}
export declare class SExpNode {
    first: SExp;
    rest: SExp | null;
    constructor(first: SExp, rest: SExp | null | SExpNode);
}
export declare class BadExpr {
}
