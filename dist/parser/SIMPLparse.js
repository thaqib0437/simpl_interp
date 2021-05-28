"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const SIMPLtypes_1 = require("./SIMPLtypes");
const parsesexp_1 = require("./SExpParse/parsesexp");
const types_1 = require("./types");
const keywords_1 = require("./keywords");
const doParse = (sexp) => {
    let result = null;
    if (!(sexp instanceof types_1.SExpNode)) {
        return result;
    }
    let lst = sexp;
    let n = len(sexp);
    if (n < 3) {
        return "Expected (vars [(id val)...] stmt...)";
    }
    if (!(lst.first instanceof types_1.Token)) {
        return "Expected (vars [(id val)...] stmt...), Error: first element is not a token";
    }
    if (lst.first.lexme != "vars") {
        return "Expected (vars [(id val)...] stmt...), Error: first element should be vars";
    }
    let decls;
    if (lst.rest instanceof types_1.SExpNode) {
        decls = lst.rest.first;
    }
    if (!(decls instanceof types_1.SExpNode)) {
        return "Expected (vars [(id val)...] stmt...), Error: list of vars must be a list";
    }
    let declAst = parseDeclseq(decls);
    if (typeof declAst == 'string') {
        return declAst;
    }
    let stmt = parseSeq((lst.rest instanceof types_1.SExpNode) ? (lst.rest.rest) : null);
    if (typeof stmt == 'string') {
        return stmt;
    }
    return new SIMPLtypes_1.Program(true, declAst, stmt);
};
const parseSeq = (lst) => {
    if (lst == null) {
        return "Program cannot be empty";
    }
    const n = len(lst);
    if (n == 1) {
        return parseStmt((lst instanceof types_1.SExpNode) ? lst.first : null);
    }
    let stmt1 = (lst instanceof types_1.SExpNode) ? parseStmt(lst.first) : "BadExpr";
    if (typeof stmt1 == 'string') {
        return stmt1;
    }
    let stmt2 = (lst instanceof types_1.SExpNode) ? parseSeq(lst.rest) : "BadExpr";
    if (typeof stmt2 == 'string') {
        return stmt2;
    }
    return new SIMPLtypes_1.Seq(stmt1, stmt2);
};
const parseStmt = (sexp) => {
    if (sexp instanceof types_1.Token) {
        return "Bad expression";
    }
    let lst;
    if (sexp instanceof types_1.SExpNode) {
        lst = sexp;
    }
    let n = len(lst);
    if (!n) {
        return "Empty Statement";
    }
    let first = lst.first;
    if (!(first instanceof types_1.Token)) {
        return "Statement Cannot be a list";
    }
    let t = first;
    if (t.type != types_1.TokenType.ID) {
        return "Statement must begin with a key word. ";
    }
    if (t.lexme === "skip") {
        if (n != 1) {
            return "Skip takes no args";
        }
        return new SIMPLtypes_1.Skip();
    }
    if (t.lexme === "seq") {
        if (n != 3) {
            return "Seq takes 2 args";
        }
        let stmt1 = (lst.rest instanceof types_1.SExpNode) ? parseStmt(lst.rest.first) : "x";
        if (typeof stmt1 == 'string') {
            return stmt1;
        }
        let stmt2 = (lst.rest instanceof types_1.SExpNode) ?
            (lst.rest.rest instanceof types_1.SExpNode) ?
                parseStmt(lst.rest.rest.first) : "x" : "x";
        if (typeof stmt2 == 'string') {
            return stmt2;
        }
        return new SIMPLtypes_1.Seq(stmt1, stmt2);
    }
    if (t.lexme === "set") {
        if (n != 3) {
            return "Set takes 2 args. (set var expr)";
        }
        let second = (lst.rest instanceof types_1.SExpNode) ? lst.rest.first : "X";
        if (!(second instanceof types_1.Token)) {
            return "First argumet of set must be an ID. (set ID expr)";
        }
        if (second.tokenType != types_1.TokenType.ID) {
            return "First argumet of set must be an ID. (set ID expr)";
        }
        if (isKeyWord(second.lexme)) {
            return `Variable stmt cannot be a key word. Given: (set ${second.lexme} ...)`;
        }
        let expr = (lst.rest instanceof types_1.SExpNode) ?
            (lst.rest.rest instanceof types_1.SExpNode) ?
                parseAE(lst.rest.rest.first) : "x" : "x";
        if (typeof expr == 'string') {
            return expr;
        }
        return new SIMPLtypes_1.Set(second.lexme, expr);
    }
    if (t.lexme === "print") {
        if (n != 2) {
            return "print takes one argument";
        }
        let expr = (lst.rest instanceof types_1.SExpNode) ? parseAE(lst.rest.first) : "x";
        if (typeof expr == 'string') {
            return expr;
        }
        return new SIMPLtypes_1.Print(expr);
    }
    if (t.lexme === "iif") {
        if (n != 4) {
            return "iif takes 3 arguments";
        }
        let test = (lst.rest instanceof types_1.SExpNode) ? parseBE(lst.rest.first) : "BadIif";
        if (typeof test == 'string') {
            return test;
        }
        let tstmt = (lst.rest instanceof types_1.SExpNode) ?
            (lst.rest.rest instanceof types_1.SExpNode) ?
                parseStmt(lst.rest.rest.first) : "BadIif" : "BadIif";
        if (typeof tstmt == 'string') {
            return tstmt;
        }
        let fstmt = (lst.rest instanceof types_1.SExpNode) ?
            (lst.rest.rest instanceof types_1.SExpNode) ?
                (lst.rest.rest.rest instanceof types_1.SExpNode) ?
                    parseStmt(lst.rest.rest.rest.first) : "BadIif" : "BadIif" : "BadIif";
        if (typeof fstmt == 'string') {
            return fstmt;
        }
        return new SIMPLtypes_1.Iif(test, tstmt, fstmt);
    }
    if (t.lexme == "while") {
        if (n < 3) {
            return "while takes a test and a body. (while (tst) body ...)";
        }
        let tst = (lst.rest instanceof types_1.SExpNode) ? parseBE(lst.rest.first) : "BadWhile";
        if (typeof tst == 'string') {
            return tst;
        }
        let body = (lst.rest instanceof types_1.SExpNode) ? parseSeq(lst.rest.rest) : "BadWhile";
        if (typeof body == 'string') {
            return body;
        }
        return new SIMPLtypes_1.While(tst, body);
    }
    else {
        return `Statement must begin with a key word. ${keywords_1.keywords}`;
    }
};
const parseBE = (sexp) => {
    if (sexp instanceof types_1.BadExpr) {
        return "BadExpr";
    }
    if (sexp instanceof types_1.Token) {
        let t = sexp;
        if (t.lexme != "true" && t.lexme != "false") {
            return `Invalid Boolean literal ${t.lexme}`;
        }
        return new SIMPLtypes_1.BELit((t.lexme == "true") ? true : false);
    }
    else if (sexp instanceof types_1.SExpNode) {
        let lst = sexp;
        let n = len(lst);
        if (n < 2) {
            return "Bad Boolean Expression";
        }
        let first = lst.first;
        if (!(first instanceof types_1.Token)) {
            return "BExp must begin with an operator";
        }
        let op = first;
        if (op.lexme === "not") {
            if (n != 2) {
                return "not requires one argument. (not bexpr)";
            }
            let operand = (lst.rest instanceof types_1.SExpNode) ? lst.rest.first : "x";
            let arg = parseBE(operand);
            if (typeof arg == 'string') {
                return arg;
            }
            return new SIMPLtypes_1.BENot(arg);
        }
        if (op.lexme === "and") {
            return (lst.rest instanceof types_1.SExpNode) ? parseAnd(lst.rest) : "Badexpr";
        }
        if (op.lexme === "or") {
            return (lst.rest instanceof types_1.SExpNode) ? parseOR(lst.rest) : "Badexpr";
        }
        else if (iscompOp(op.lexme)) {
            if (n != 3) {
                return "CompareOP requires 2 arguments";
            }
            let arg1 = (lst.rest instanceof types_1.SExpNode) ? parseAE(lst.rest.first) : "BadExpr";
            if (typeof arg1 == 'string') {
                return arg1;
            }
            let arg2 = (lst.rest instanceof types_1.SExpNode) ?
                (lst.rest.rest instanceof types_1.SExpNode) ?
                    parseAE(lst.rest.rest.first) : "BadExpr" : "BadExpr";
            if (typeof arg2 == 'string') {
                return arg2;
            }
            return new SIMPLtypes_1.BECompare(op.lexme, arg1, arg2);
        }
        else {
            return "Invalid Boolean Operator";
        }
    }
};
const parseAnd = (sexp) => {
    let n = len(sexp);
    if (n == 0) {
        return new SIMPLtypes_1.BELit(true);
    }
    else if (n == 1) {
        return parseBE(sexp.first);
    }
    else {
        let rest = (sexp.rest instanceof types_1.SExpNode) ? parseAnd(sexp.rest) : "BadExpr";
        if (typeof rest == 'string') {
            return rest;
        }
        let first = parseBE(sexp.first);
        if (typeof first == 'string') {
            return first;
        }
        return new SIMPLtypes_1.BEAnd(first, rest);
    }
};
const parseOR = (lst) => {
    let n = len(lst);
    if (n == 0) {
        return new SIMPLtypes_1.BELit(false);
    }
    else if (n == 1) {
        return parseBE(lst.first);
    }
    else {
        let rest = (lst.rest instanceof types_1.SExpNode) ? parseOR(lst.rest) : "BadExpr";
        if (typeof rest == 'string') {
            return rest;
        }
        let first = parseBE(lst.first);
        if (typeof first == 'string') {
            return first;
        }
        return new SIMPLtypes_1.BEOr(first, rest);
    }
};
const parseAE = (sexp) => {
    if (sexp instanceof types_1.BadExpr) {
        return "BadExpr";
    }
    if (sexp instanceof types_1.Token) {
        let t = sexp;
        if (t.tokenType == types_1.TokenType.ID) {
            return new SIMPLtypes_1.AEId(t.lexme);
        }
        else if (t.tokenType == types_1.TokenType.NUM) {
            let val = parseFloat(t.lexme);
            return new SIMPLtypes_1.AENum(val);
        }
        else {
            return "BadExpr";
        }
    }
    else if (sexp instanceof types_1.SExpNode) {
        let lst = sexp;
        if (len(lst) != 3) {
            return "Incorrect Binary arithmetic expr";
        }
        let op, first, second, third;
        first = (lst.first);
        second = (lst.rest instanceof types_1.SExpNode) ? lst.rest.first : "x";
        third = (lst.rest instanceof types_1.SExpNode) ?
            (lst.rest.rest instanceof types_1.SExpNode) ? lst.rest.rest.first : "X" : "X";
        if (!(first instanceof types_1.Token)) {
            return "AExp must begin with an operator.";
        }
        let operator = first;
        if (!isOp(operator.lexme)) {
            return `Operator must be one of ${keywords_1.OP}`;
        }
        op = keywords_1.OPmap[operator.lexme];
        let arg1 = parseAE(second);
        if (typeof arg1 == 'string') {
            return arg1;
        }
        let arg2 = parseAE(third);
        if (typeof arg2 == 'string') {
            return arg2;
        }
        return new SIMPLtypes_1.AEBin(op, arg1, arg2);
    }
};
const parseDeclseq = (lst) => {
    if (!lst) {
        return null;
    }
    let decl;
    if (lst instanceof types_1.SExpNode) {
        decl = lst.first;
    }
    if (!(decl instanceof types_1.SExpNode) || len(decl) != 2) {
        return "Expected (id val)";
    }
    let V = decl.first;
    if (!(V instanceof types_1.Token) || V.type != types_1.TokenType.ID) {
        return "Expected (id val), Error: First part of variable must be and ID";
    }
    if (isKeyWord(V.lexme)) {
        return `Error: Var name cannot be keyword, given: (${V.lexme} ...)`;
    }
    let VarName = V.lexme;
    let val;
    if (decl.rest instanceof types_1.SExpNode) {
        val = decl.rest.first;
    }
    if (!(val instanceof types_1.Token) || val.tokenType != types_1.TokenType.NUM) {
        return `Value in (id val) must be a number`;
    }
    let declRes = { var: "", val: 0.0 };
    declRes.var = V.lexme;
    declRes.val = parseFloat(val.lexme);
    let rest;
    if (lst instanceof types_1.SExpNode) {
        rest = parseDeclseq(lst.rest);
    }
    if (typeof rest == 'string') {
        return rest;
    }
    let res = { decl: declRes, next: rest };
    return res;
};
const isKeyWord = (s) => keywords_1.keywords.filter((v) => v == s).length >= 1;
const isOp = (s) => keywords_1.OP.filter((v) => v == s).length >= 1;
const iscompOp = (s) => keywords_1.compOP.filter((v) => v == s).length >= 1;
const len = (f) => {
    if (!f) {
        return 0;
    }
    else {
        return 1 + len(f.rest);
    }
};
const ParseProgram = (prog) => {
    let sexp = parsesexp_1.parseSExp(prog);
    let p = doParse(sexp);
    return p;
};
exports.default = ParseProgram;
