import ParseProgram from './parser/SIMPLparse';
import { AEAST, AEBin, AEId, AENum, BEAnd, BEAST, BECompare, BELit, BENot, BEOr, DeclListNode, Iif, Print, Program, Seq, Set, Skip, StmtAST, While } from './parser/SIMPLtypes';

const BinOP = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => a % b
};

const BEComp = {
    '=': (a,b) => a===b,
    '>': (a,b) => a>b,
    '<': (a,b) => a<b,
    '>=': (a,b) => a>=b,
    '<=': (a,b) => a<=b
}

const makeMap = (dec: DeclListNode): Map<string, number> => {
    const mp = new Map<string, number>();
    let head = dec;
    while (head) {
        mp.set(head.decl.var, head.decl.val);
        head = head.next;
    }
    return mp;
}

const searchEnv = (s, mp: Map<string, number>): Promise<number> => {
    return new Promise((resolve, reject) => {
        let val = mp.get(s);
        if (val == undefined) {
            reject(`Variable not found ${s}`);
        }
        else {
            resolve(val);
        }
    });
}


const evalBExp = (bexp: BEAST, mp: Map<string, number>): Promise<boolean> =>{
    return new Promise((resolve, reject) => {
        if(bexp instanceof BECompare){
            Promise.all([bexp.op,evalAEast(bexp.arg1, mp), evalAEast(bexp.arg2, mp)])
            .then(([op, arg1, arg2])=>{
                resolve(BEComp[op](arg1, arg2));
            })
            .catch(c => reject(c));
        }
        else if(bexp instanceof BENot){
            const arg = evalBExp(bexp.arg,mp)
            .then(v => resolve(!v))
            .catch(c => reject(c));
        }
        else if(bexp instanceof BEAnd){
            Promise.all([evalBExp(bexp.arg1,mp), evalBExp(bexp.arg2, mp)])
            .then(([a1,a2])=>{
                resolve(a1 && a2);
            })
            .catch(c => reject(c));
        }
        else if(bexp instanceof BEOr){
            Promise.all([evalBExp(bexp.arg1,mp), evalBExp(bexp.arg2, mp)])
            .then(([a1,a2])=>{
                resolve(a1 || a2);
            })
            .catch(c => reject(c));
        }
        else if(bexp instanceof BELit){
            resolve(bexp.val);
        }
        
    })
}

const evalAEast = (aexp: AEAST, mp: Map<string, number>): Promise<number> => {
    return new Promise((resolve, reject) => {
        if (aexp instanceof AEBin) {
            Promise.all([aexp.op, evalAEast(aexp.arg1, mp), evalAEast(aexp.arg2, mp)])
                .then(([op, a1, a2]) => {
                    if (op == '/' && a2 === 0) {
                        reject('Div by zero Error');
                    }
                    else if(op=='%' && a2 === 0){
                        reject('Mod by zero Error x % 0 is undefined');
                    }
                    else {
                        resolve(BinOP[op](a1, a2));
                    }
                }).catch(c => reject(c));
        }
        else if (aexp instanceof AENum) {
            resolve(aexp.val);
        }
        else if (aexp instanceof AEId) {
            const v = searchEnv(aexp.name, mp).then((v) => resolve(v))
                .catch(c => reject(c));
        }
    })
}

const setVar = (val: string, expr: AEAST, mp: Map<string, number>):Promise<Map<string, number>> => {
    return new Promise((resolve, reject) => {
        const newVal = evalAEast(expr, mp)
            .then((v: number) => {
                mp.set(val, v);
                resolve(mp);
            }).catch(c => reject(c));
    })
}

const interpSimpl = (AST: StmtAST, env: Map<string, number>, out: (string | number)[]): Promise<[(string | number)[], Map<string, number>]> => {
    return new Promise((resolve, reject) => {
        if (AST instanceof Skip) {
            resolve([out, env]);
        }
        else if (AST instanceof Set) {
            const newMap = setVar(AST.val, AST.expr, env)
                .then(mp => resolve([out, mp]))
                .catch(c => reject([c]));
        }
        else if (AST instanceof Print) {
            const to_print = evalAEast(AST.expr, env)
                .then((v) => resolve([[...out, v], env]))
                .catch(c => {
                    reject(c);
                });
        }
        else if(AST instanceof Iif){
            evalBExp(AST.test, env)
            .then(t => {
                if(t){
                    const i = interpSimpl(AST.tstmt, env, out)
                    .then(a => resolve(a))
                    .catch(c => reject(c));
                }
                else{
                    const i = interpSimpl(AST.fstmt, env, out)
                    .then(a => resolve(a))
                    .catch(c => reject(c));
                }
            })
            .catch(c => reject(c));
        }
        else if(AST instanceof While){
            const loop = AST;
            const IIF = new Iif(loop.test, new Seq(loop.body, loop), new Skip());
            interpSimpl(IIF, env, out)
            .then(t => resolve(t))
            .catch(c => reject(c));
        }
        else if(AST instanceof Seq){
            interpSimpl(AST.stmt1, env, out)
            .then(([o, nenv]) =>{
                interpSimpl(AST.stmt2, nenv, o)
                .then(t => resolve(t))
                .catch(c => reject(c))
            })
            .catch(c => reject(c));
        }
    });
}

const interp = (inp: string): Promise<(string | number)[]> => {
    return new Promise((resolve, reject) => {
        const prog: Program | string = ParseProgram(inp);
        if (typeof prog == 'string') {
            reject([prog]);
        }
        if (prog instanceof Program) {
            const global_env = makeMap(prog.decls);
            interpSimpl(prog.stmt, global_env, []).then(v => {
                resolve(v[0]);
            })
                .catch(c => { reject(c) });
        }
    });
}

let p = interp('(vars [(i 100) (j 200) (k 300)] (while (> i 0) (print i) (set i (- i 1))) (print i))')        
    .then(v => console.log(v))
    .catch(c => console.log(c));