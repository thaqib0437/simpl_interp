import { Program, StmtAST } from './parser/SIMPLtypes';
export declare const interpSimpl: (AST: StmtAST, env: Map<string, number>, out: (string | number)[]) => Promise<[(string | number)[], Map<string, number>]>;
export declare const interp: (inp: string) => Promise<(string | number)[]>;
export declare const getAST: (inp: string) => Program | string;
