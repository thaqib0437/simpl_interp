import { scan } from '../scanner/scan';
import {Token} from '../types';

const splitProg = (prog: string) => prog.split("");
const tokenizeArr = (progArr: string[]): Token[] =>{
    let res: Token[] = [];

    let i = 0; 
    const n = progArr.length;
    while(i<n){
        let [T,j] = scan(progArr,i);
        res.push(T); 
        i = j+1;
    }
    return res;
}

export const tokenizeProg = (prog: string): Token[] => tokenizeArr(splitProg(prog));
