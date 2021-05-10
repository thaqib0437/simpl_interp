
export type AEAST = AEBin | AENum | AEId;
export class  AEBin{
    op: string;
    arg1: AEAST;
    arg2: AEAST;
}
export class AENum {
    val: number;
}
export class AEId{
    name: string
}

export type BEAST = BECompare | BENot | BEAnd | BEOr | BELit;
export class BECompare{
    op: string;
    arg1: AEAST;
    arg2: AEAST;
}
export class BENot{
    arg : BEAST;
}
export class BEAnd {
    arg1: BEAST;
    arg2: BEAST;
}
export class BEOr {
    arg1: BEAST;
    arg2: BEAST;
}
export class BELit {
    val: number;
}

export type StmtAST = Skip | Set | Seq | Print | Iif | While; 
export class Skip {}
export class Set{
    val: string;
    expr: AEAST;
}
export class Seq{
    stmt1: StmtAST;
    stmt2: StmtAST;
}
export class Print {
    expr: AEAST;
}
export class Iif {
    test: BEAST;
    tstmt: StmtAST;
    fstmt: StmtAST;
}
export class While{
    test: BEAST;
    body: StmtAST;
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
}
