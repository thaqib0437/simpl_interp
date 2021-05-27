
export type AEAST = AEBin | AENum | AEId;
export class  AEBin{
    op: string;
    arg1: AEAST;
    arg2: AEAST;
    constructor(op, a1,a2){
        this.op = op;
        this.arg1 = a1;
        this.arg2 = a2;
    }
}
export class AENum {
    val: number;
    constructor(v: number){
        this.val = v;
    }
}
export class AEId{
    name: string
    constructor(n:string){
        this.name = n;
    }
}

export type BEAST = BECompare | BENot | BEAnd | BEOr | BELit;
export class BECompare{
    op: string;
    arg1: AEAST;
    arg2: AEAST;
    constructor(o,a1,a2){
        this.op = o;
        this.arg1 = a1;
        this.arg2 = a2;
    }
}
export class BENot{
    arg : BEAST;
    constructor(arg){
        this.arg = arg;
    }
}
export class BEAnd {
    arg1: BEAST;
    arg2: BEAST;
    constructor(f,r){
        this.arg1 = f;
        this.arg2 = r;
    }
}
export class BEOr {
    arg1: BEAST;
    arg2: BEAST;
    constructor(f,r){
        this.arg1 = f;
        this.arg2 = r;
    }
}
export class BELit {
    val: boolean;
    constructor(v){
        this.val = v;
    }
}

export type StmtAST = Skip | Set | Seq | Print | Iif | While; 
export class Skip {}
export class Set{
    val: string;
    expr: AEAST;
    constructor(v, e){
        this.val = v;
        this.expr = e;
    }
}
export class Seq{
    stmt1: StmtAST;
    stmt2: StmtAST;
    constructor(s1,s2){
        this.stmt1 = s1;
        this.stmt2 = s2;
    }
}
export class Print {
    expr: AEAST;
    constructor(e){
        this.expr = e;
    }
}
export class Iif {
    test: BEAST;
    tstmt: StmtAST;
    fstmt: StmtAST;
    constructor(tst, ts, fs){
        this.test = tst;
        this.tstmt = ts;
        this.fstmt = fs;
    }
}
export class While{
    test: BEAST;
    body: StmtAST;
    constructor(t,b){
        this.test = t;
        this.body = b;
    }
}


export class Decl{
    var: string;
    val: number;
}
export class DeclListNode {
    decl: Decl;
    next: DeclListNode;
}

export class Program {
    valid: boolean;
    decls: DeclListNode;
    stmt: StmtAST;
    constructor(v, decls, stmt){
        this.valid = v;
        this.decls = decls;
        this.stmt = stmt;
    }
}
