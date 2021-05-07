import { BadExpr, SExp, SExpNode, Token, TokenType } from '../types';
import { tokenizeProg } from './tokenize';


export const parseSExp = (prog: string): SExp =>  parseStreamSExp(arrayGenerator(tokenizeProg(prog)));


function* arrayGenerator<T>(array: Array<T>): Generator<T,null,T>{
    let index = 0;
    while(index < array.length){
        yield array[index];
        index++; 
    }
    return null;
}


const parseStreamSExp = (prog: Generator<Token, null, Token>): SExp => {
    let t: Token = prog.next().value;
    let result: SExp; 
    let ttyp = t.type;
    if(ttyp === TokenType.RPAREN || ttyp === TokenType.RBRACK || ttyp === TokenType.DONE || ttyp === TokenType.ERROR){
        result = new BadExpr();
        return result;
    }
    else if(ttyp == TokenType.ID || ttyp === TokenType.OP || ttyp === TokenType.NUM){
        result = t;
        return result;
    }
    else if(ttyp === TokenType.LPAREN || ttyp === TokenType.LBRACK){
        result = parseSExpList(prog, ttyp);
        if(result instanceof BadExpr){
            return new BadExpr();
        }
        return result;
    }
    return result;
} 


const parseSExpList = (prog: Generator<Token, null, Token>, open: TokenType): SExp  => {
    let gt = prog.next();
    if(gt.done){
        return new BadExpr();
    }
    let t:Token = gt.value;
    if(t.type === TokenType.ERROR){
        return new BadExpr();
    }
    if(t.type === TokenType.RBRACK || t.type === TokenType.RPAREN){
        return (t.type === mth(open))? null : new BadExpr();
    }

    let item: SExp;
    if(t.type === TokenType.LBRACK || t.type === TokenType.LPAREN){
        let first: SExp = parseSExpList(prog, t.type);
        if(first instanceof BadExpr){
            return new BadExpr();
        }

        item = first;
    }
    else if (t.type === TokenType.ID || t.type === TokenType.NUM || t.type === TokenType.OP) {
        item = t;
    }

    let rest: SExp = parseSExpList(prog,open);
    if(rest instanceof BadExpr){
        return new BadExpr();
    }
    return new SExpNode(item, rest);
}


const mth = (left: TokenType):TokenType => {
   return (left===TokenType.LPAREN)?(TokenType.RPAREN)
          :(left===TokenType.LBRACK)?(TokenType.RBRACK)
          :TokenType.ERROR;
}
