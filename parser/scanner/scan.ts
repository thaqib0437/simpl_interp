import {Token, TokenType} from '../types';

const isAlpha = (c:string):boolean => (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');
const isNumber = (c: string):boolean => (c >= '0' && c<='9');
export function scan(prog: string[], i: number): [Token,number] {
    let c: string = prog[i];
    let tkType: TokenType = TokenType.ERROR;
    while(c===' ' || c==='\t' || c==='\n'){
        i++; 
        c = prog[i];
    }
    if(c==undefined){
        tkType = TokenType.DONE;
    }
    else if(c==='('){
        tkType = TokenType.LPAREN;
    }
    else if(c===')'){
        tkType = TokenType.RPAREN;
    }
    else if(c==='['){
        tkType = TokenType.LBRACK;
    }
    else if(c===']'){
        tkType = TokenType.RBRACK;
    }
    else if(c==='+' || c==='*' || c==='/' || 
            c==='=' ||c==='<' || c==='>' || c==='-')
    {
        tkType = TokenType.OP;
        let next: string = prog[i+1];
        if(next==='='){
            c = `${c}` + `${next}`;
            i++;
        }
    } 
    else if(isNumber(c)){
        tkType = TokenType.NUM;
        let next: string = prog[i+1];
        while(isNumber(next) || next == '.'){
            c = `${c}` + `${next}`;
            i++;
            next = prog[i+1];
        }
    }
    else if(isAlpha(c)){
        tkType = TokenType.ID;
        let next: string = prog[i+1];
        while(isAlpha(next) || Number(next)){
            c = `${c}` + `${next}`;
            i++; 
            next = prog[i+1];
        }
    }
    const t: Token = new Token(tkType, c);
    return [t,i];
}