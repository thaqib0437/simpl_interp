import {SExp, SExpType} from './SExpParse';

export enum TokenType {
    LPAREN = 0, 
    RPAREN, 
    LBRACK, 
    RBRACK, 
    ID,
    NUM, 
    OP, 
    DONE, 
    ERROR
}

export class Token implements SExp{
    type = SExpType.ATOM;
    tokenType: TokenType | null = null; 
    lexme: String | null = null; 
}

const isAlpha = (c:string):boolean => (c >= 'A' && c <= 'Z') || (c >= 'a' && c <= 'z');


export function scan(prog: String): [Token , number]{
    let i: number  = 0;
    let t: Token = {type: SExpType.ATOM,tokenType: 0, lexme: ''};
    let c: string = prog[i];
    while(c===' '){
        i++;
        c=prog[i];
    }
    if(c==undefined){
        t.tokenType = TokenType.DONE;
    }
    else if(c==='('){
        t.tokenType = TokenType.LPAREN;
    }
    else if(c===')'){
        t.tokenType = TokenType.RPAREN;
    }
    else if(c==='['){
        t.tokenType = TokenType.LBRACK;
    }
    else if(c===']'){
        t.tokenType = TokenType.RBRACK;
    }
    else if(c==='+' || c==='*' || c==='/' || 
            c==='=' ||c==='<' || c==='>' || c==='-')
    {
        t.tokenType = TokenType.OP;
        let next: string = prog[i+1];
        if(next==='='){
            c = `${c}` + `${next}`;
            i++;
        }
    } 
    else if(Number(c)){
        t.tokenType = TokenType.NUM;
        let next: string = prog[i+1];
        while(Number(next)){
            c = `${c}` + `${next}`;
            i++;
            next = prog[i+1];
        }
    }
    else if(isAlpha(c)){
        t.tokenType = TokenType.ID;
        let next: string = prog[i+1];
        while(isAlpha(next) || Number(next)){
            c = `${c}` + `${next}`;
            i++; 
            next = prog[i+1];
        }
    }
    t.lexme = c;
    return [t,i];
}
