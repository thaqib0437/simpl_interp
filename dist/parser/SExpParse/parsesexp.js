"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.parseSExp = void 0;
const types_1 = require("../types");
const tokenize_1 = require("./tokenize");
const parseSExp = (prog) => parseStreamSExp(arrayGenerator(tokenize_1.tokenizeProg(prog)));
exports.parseSExp = parseSExp;
function* arrayGenerator(array) {
    let index = 0;
    while (index < array.length) {
        yield array[index];
        index++;
    }
    return null;
}
const parseStreamSExp = (prog) => {
    let t = prog.next().value;
    let result;
    let ttyp = t.type;
    if (ttyp === types_1.TokenType.RPAREN || ttyp === types_1.TokenType.RBRACK || ttyp === types_1.TokenType.DONE || ttyp === types_1.TokenType.ERROR) {
        result = new types_1.BadExpr();
        return result;
    }
    else if (ttyp == types_1.TokenType.ID || ttyp === types_1.TokenType.OP || ttyp === types_1.TokenType.NUM) {
        result = t;
        return result;
    }
    else if (ttyp === types_1.TokenType.LPAREN || ttyp === types_1.TokenType.LBRACK) {
        result = parseSExpList(prog, ttyp);
        if (result instanceof types_1.BadExpr) {
            return new types_1.BadExpr();
        }
        return result;
    }
    return result;
};
const parseSExpList = (prog, open) => {
    let gt = prog.next();
    if (gt.done) {
        return new types_1.BadExpr();
    }
    let t = gt.value;
    if (t.type === types_1.TokenType.ERROR) {
        return new types_1.BadExpr();
    }
    if (t.type === types_1.TokenType.RBRACK || t.type === types_1.TokenType.RPAREN) {
        return (t.type === mth(open)) ? null : new types_1.BadExpr();
    }
    let item;
    if (t.type === types_1.TokenType.LBRACK || t.type === types_1.TokenType.LPAREN) {
        let first = parseSExpList(prog, t.type);
        if (first instanceof types_1.BadExpr) {
            return new types_1.BadExpr();
        }
        item = first;
    }
    else if (t.type === types_1.TokenType.ID || t.type === types_1.TokenType.NUM || t.type === types_1.TokenType.OP) {
        item = t;
    }
    let rest = parseSExpList(prog, open);
    if (rest instanceof types_1.BadExpr) {
        return new types_1.BadExpr();
    }
    return new types_1.SExpNode(item, rest);
};
const mth = (left) => {
    return (left === types_1.TokenType.LPAREN) ? (types_1.TokenType.RPAREN)
        : (left === types_1.TokenType.LBRACK) ? (types_1.TokenType.RBRACK)
            : types_1.TokenType.ERROR;
};
