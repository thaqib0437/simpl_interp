import {scan, Token, TokenType} from './scan'; 

export enum SExpType {
    ATOM = 0, 
    LIST, 
    BADSEXP
};

export interface SExp{
    type: SExpType;
}
class SExpNode implements SExp{
    type = SExpType.LIST;
    first: SExp | null = null;
    rest: SExpNode | null = null; 
}

function parseSExp(prog: String){
}

console.log(parseSExp(" )"))