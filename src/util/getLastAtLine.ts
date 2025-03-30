import { FunctionParsing } from "../types/functions";

export default function getLastAtLine(fs: FunctionParsing[]): FunctionParsing {
    const r: number = fs[0].line;
    let f: FunctionParsing = fs[0];
    for(let i = fs.length - 1; i >= 0; i--) {
        if(fs[i].line === r) {
            f = fs[i];
            break;
        }
    }
    return f;
}