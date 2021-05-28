"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BadExpr = exports.SExpNode = exports.Token = exports.TokenType = void 0;
var TokenType;
(function (TokenType) {
    TokenType["LPAREN"] = "LPAREN";
    TokenType["RPAREN"] = "RPAREN";
    TokenType["LBRACK"] = "LBRACK";
    TokenType["RBRACK"] = "RBRACK";
    TokenType["ID"] = "ID";
    TokenType["NUM"] = "NUM";
    TokenType["OP"] = "OP";
    TokenType["DONE"] = "DONE";
    TokenType["ERROR"] = "ERROR";
})(TokenType = exports.TokenType || (exports.TokenType = {}));
class Token {
    constructor(type, lex) {
        this.tokenType = type;
        this.lexme = lex;
    }
    get type() {
        return this.tokenType;
    }
}
exports.Token = Token;
class SExpNode {
    constructor(first, rest) {
        this.first = first;
        this.rest = rest;
    }
}
exports.SExpNode = SExpNode;
class BadExpr {
}
exports.BadExpr = BadExpr;
