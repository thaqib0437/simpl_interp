export declare type AEAST = AEBin | AENum | AEId;
export declare class AEBin {
    op: string;
    arg1: AEAST;
    arg2: AEAST;
    constructor(op: any, a1: any, a2: any);
}
export declare class AENum {
    val: number;
    constructor(v: number);
}
export declare class AEId {
    name: string;
    constructor(n: string);
}
export declare type BEAST = BECompare | BENot | BEAnd | BEOr | BELit;
export declare class BECompare {
    op: string;
    arg1: AEAST;
    arg2: AEAST;
    constructor(o: any, a1: any, a2: any);
}
export declare class BENot {
    arg: BEAST;
    constructor(arg: any);
}
export declare class BEAnd {
    arg1: BEAST;
    arg2: BEAST;
    constructor(f: any, r: any);
}
export declare class BEOr {
    arg1: BEAST;
    arg2: BEAST;
    constructor(f: any, r: any);
}
export declare class BELit {
    val: boolean;
    constructor(v: any);
}
export declare type StmtAST = Skip | Set | Seq | Print | Iif | While;
export declare class Skip {
}
export declare class Set {
    val: string;
    expr: AEAST;
    constructor(v: any, e: any);
}
export declare class Seq {
    stmt1: StmtAST;
    stmt2: StmtAST;
    constructor(s1: any, s2: any);
}
export declare class Print {
    expr: AEAST;
    constructor(e: any);
}
export declare class Iif {
    test: BEAST;
    tstmt: StmtAST;
    fstmt: StmtAST;
    constructor(tst: any, ts: any, fs: any);
}
export declare class While {
    test: BEAST;
    body: StmtAST;
    constructor(t: any, b: any);
}
export declare class Decl {
    var: string;
    val: number;
}
export declare class DeclListNode {
    decl: Decl;
    next: DeclListNode;
}
export declare class Program {
    valid: boolean;
    decls: DeclListNode;
    stmt: StmtAST;
    constructor(v: any, decls: any, stmt: any);
}
