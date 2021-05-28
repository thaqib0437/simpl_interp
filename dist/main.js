"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAST = exports.interp = exports.interpSimpl = void 0;
const SIMPLparse_1 = require("./parser/SIMPLparse");
const SIMPLtypes_1 = require("./parser/SIMPLtypes");
const BinOP = {
    '+': (a, b) => a + b,
    '-': (a, b) => a - b,
    '*': (a, b) => a * b,
    '/': (a, b) => a / b,
    '%': (a, b) => a % b,
    'divi': (a, b) => Math.floor(a / b)
};
const BEComp = {
    '=': (a, b) => a === b,
    '>': (a, b) => a > b,
    '<': (a, b) => a < b,
    '>=': (a, b) => a >= b,
    '<=': (a, b) => a <= b
};
const makeMap = (dec) => {
    const mp = new Map();
    let head = dec;
    while (head) {
        mp.set(head.decl.var, head.decl.val);
        head = head.next;
    }
    return mp;
};
const searchEnv = (s, mp) => {
    return new Promise((resolve, reject) => {
        let val = mp.get(s);
        if (val == undefined) {
            reject(`Variable not found ${s}`);
        }
        else {
            resolve(val);
        }
    });
};
const evalBExp = (bexp, mp) => {
    return new Promise((resolve, reject) => {
        if (bexp instanceof SIMPLtypes_1.BECompare) {
            Promise.all([bexp.op, evalAEast(bexp.arg1, mp), evalAEast(bexp.arg2, mp)])
                .then(([op, arg1, arg2]) => {
                resolve(BEComp[op](arg1, arg2));
            })
                .catch(c => reject(c));
        }
        else if (bexp instanceof SIMPLtypes_1.BENot) {
            const arg = evalBExp(bexp.arg, mp)
                .then(v => resolve(!v))
                .catch(c => reject(c));
        }
        else if (bexp instanceof SIMPLtypes_1.BEAnd) {
            Promise.all([evalBExp(bexp.arg1, mp), evalBExp(bexp.arg2, mp)])
                .then(([a1, a2]) => {
                resolve(a1 && a2);
            })
                .catch(c => reject(c));
        }
        else if (bexp instanceof SIMPLtypes_1.BEOr) {
            Promise.all([evalBExp(bexp.arg1, mp), evalBExp(bexp.arg2, mp)])
                .then(([a1, a2]) => {
                resolve(a1 || a2);
            })
                .catch(c => reject(c));
        }
        else if (bexp instanceof SIMPLtypes_1.BELit) {
            resolve(bexp.val);
        }
    });
};
const evalAEast = (aexp, mp) => {
    return new Promise((resolve, reject) => {
        if (aexp instanceof SIMPLtypes_1.AEBin) {
            Promise.all([aexp.op, evalAEast(aexp.arg1, mp), evalAEast(aexp.arg2, mp)])
                .then(([op, a1, a2]) => {
                if (op == '/' && a2 === 0) {
                    reject('Div by zero Error');
                }
                else if (op == '%' && a2 === 0) {
                    reject('Mod by zero Error x % 0 is undefined');
                }
                else {
                    resolve(BinOP[op](a1, a2));
                }
            }).catch(c => reject(c));
        }
        else if (aexp instanceof SIMPLtypes_1.AENum) {
            resolve(aexp.val);
        }
        else if (aexp instanceof SIMPLtypes_1.AEId) {
            const v = searchEnv(aexp.name, mp).then((v) => resolve(v))
                .catch(c => reject(c));
        }
    });
};
const setVar = (val, expr, mp) => {
    return new Promise((resolve, reject) => {
        const newVal = evalAEast(expr, mp)
            .then((v) => {
            mp.set(val, v);
            resolve(mp);
        }).catch(c => reject(c));
    });
};
const interpSimpl = (AST, env, out) => {
    return new Promise((resolve, reject) => {
        if (AST instanceof SIMPLtypes_1.Skip) {
            resolve([out, env]);
        }
        else if (AST instanceof SIMPLtypes_1.Set) {
            const newMap = setVar(AST.val, AST.expr, env)
                .then(mp => resolve([out, mp]))
                .catch(c => reject([c]));
        }
        else if (AST instanceof SIMPLtypes_1.Print) {
            const to_print = evalAEast(AST.expr, env)
                .then((v) => resolve([[...out, v], env]))
                .catch(c => {
                reject(c);
            });
        }
        else if (AST instanceof SIMPLtypes_1.Iif) {
            evalBExp(AST.test, env)
                .then(t => {
                if (t) {
                    const i = exports.interpSimpl(AST.tstmt, env, out)
                        .then(a => resolve(a))
                        .catch(c => reject(c));
                }
                else {
                    const i = exports.interpSimpl(AST.fstmt, env, out)
                        .then(a => resolve(a))
                        .catch(c => reject(c));
                }
            })
                .catch(c => reject(c));
        }
        else if (AST instanceof SIMPLtypes_1.While) {
            const loop = AST;
            const IIF = new SIMPLtypes_1.Iif(loop.test, new SIMPLtypes_1.Seq(loop.body, loop), new SIMPLtypes_1.Skip());
            exports.interpSimpl(IIF, env, out)
                .then(t => resolve(t))
                .catch(c => reject(c));
        }
        else if (AST instanceof SIMPLtypes_1.Seq) {
            exports.interpSimpl(AST.stmt1, env, out)
                .then(([o, nenv]) => {
                exports.interpSimpl(AST.stmt2, nenv, o)
                    .then(t => resolve(t))
                    .catch(c => reject(c));
            })
                .catch(c => reject(c));
        }
    });
};
exports.interpSimpl = interpSimpl;
const interp = (inp) => {
    return new Promise((resolve, reject) => {
        const prog = SIMPLparse_1.default(inp);
        if (typeof prog == 'string') {
            reject([prog]);
        }
        if (prog instanceof SIMPLtypes_1.Program) {
            const global_env = makeMap(prog.decls);
            exports.interpSimpl(prog.stmt, global_env, []).then(v => {
                resolve(v[0]);
            })
                .catch(c => { reject(c); });
        }
    });
};
exports.interp = interp;
const getAST = (inp) => {
    return SIMPLparse_1.default(inp);
};
exports.getAST = getAST;
