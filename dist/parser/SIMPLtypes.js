"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Program = exports.DeclListNode = exports.Decl = exports.While = exports.Iif = exports.Print = exports.Seq = exports.Set = exports.Skip = exports.BELit = exports.BEOr = exports.BEAnd = exports.BENot = exports.BECompare = exports.AEId = exports.AENum = exports.AEBin = void 0;
class AEBin {
    constructor(op, a1, a2) {
        this.op = op;
        this.arg1 = a1;
        this.arg2 = a2;
    }
}
exports.AEBin = AEBin;
class AENum {
    constructor(v) {
        this.val = v;
    }
}
exports.AENum = AENum;
class AEId {
    constructor(n) {
        this.name = n;
    }
}
exports.AEId = AEId;
class BECompare {
    constructor(o, a1, a2) {
        this.op = o;
        this.arg1 = a1;
        this.arg2 = a2;
    }
}
exports.BECompare = BECompare;
class BENot {
    constructor(arg) {
        this.arg = arg;
    }
}
exports.BENot = BENot;
class BEAnd {
    constructor(f, r) {
        this.arg1 = f;
        this.arg2 = r;
    }
}
exports.BEAnd = BEAnd;
class BEOr {
    constructor(f, r) {
        this.arg1 = f;
        this.arg2 = r;
    }
}
exports.BEOr = BEOr;
class BELit {
    constructor(v) {
        this.val = v;
    }
}
exports.BELit = BELit;
class Skip {
}
exports.Skip = Skip;
class Set {
    constructor(v, e) {
        this.val = v;
        this.expr = e;
    }
}
exports.Set = Set;
class Seq {
    constructor(s1, s2) {
        this.stmt1 = s1;
        this.stmt2 = s2;
    }
}
exports.Seq = Seq;
class Print {
    constructor(e) {
        this.expr = e;
    }
}
exports.Print = Print;
class Iif {
    constructor(tst, ts, fs) {
        this.test = tst;
        this.tstmt = ts;
        this.fstmt = fs;
    }
}
exports.Iif = Iif;
class While {
    constructor(t, b) {
        this.test = t;
        this.body = b;
    }
}
exports.While = While;
class Decl {
}
exports.Decl = Decl;
class DeclListNode {
}
exports.DeclListNode = DeclListNode;
class Program {
    constructor(v, decls, stmt) {
        this.valid = v;
        this.decls = decls;
        this.stmt = stmt;
    }
}
exports.Program = Program;
