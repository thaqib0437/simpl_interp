"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scan = void 0;
const types_1 = require("../types");
const isAlpha = (c) => (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
const isNumber = (c) => (c >= '0' && c <= '9');
function scan(prog, i) {
    let c = prog[i];
    let tkType = types_1.TokenType.ERROR;
    while (c === ' ') {
        i++;
        c = prog[i];
    }
    if (c == undefined) {
        tkType = types_1.TokenType.DONE;
    }
    else if (c === '(') {
        tkType = types_1.TokenType.LPAREN;
    }
    else if (c === ')') {
        tkType = types_1.TokenType.RPAREN;
    }
    else if (c === '[') {
        tkType = types_1.TokenType.LBRACK;
    }
    else if (c === ']') {
        tkType = types_1.TokenType.RBRACK;
    }
    else if (c === '+' || c === '*' || c === '/' ||
        c === '=' || c === '<' || c === '>' || c === '-') {
        tkType = types_1.TokenType.OP;
        let next = prog[i + 1];
        if (next === '=') {
            c = `${c}` + `${next}`;
            i++;
        }
    }
    else if (isNumber(c)) {
        tkType = types_1.TokenType.NUM;
        let next = prog[i + 1];
        while (isNumber(next) || next == '.') {
            c = `${c}` + `${next}`;
            i++;
            next = prog[i + 1];
        }
    }
    else if (isAlpha(c)) {
        tkType = types_1.TokenType.ID;
        let next = prog[i + 1];
        while (isAlpha(next) || Number(next)) {
            c = `${c}` + `${next}`;
            i++;
            next = prog[i + 1];
        }
    }
    const t = new types_1.Token(tkType, c);
    return [t, i];
}
exports.scan = scan;
