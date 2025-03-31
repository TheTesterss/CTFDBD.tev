import Self from "../main";
import CommandMap from "./CommandMap";
import Function from "../modules/Function";
import { FunctionTypes } from "../types/functions";

export default class CommandExecutor {
    public self: Self;
    public map: CommandMap = new CommandMap();
    private stack: null[] = [];

    constructor(self: Self) {
        this.self = self;
    }

    /**
     *
     * @param content The content of the file.
     * @param log Should the result be logged at the end of the function?
     * @returns An object with the index as the key and the function data's as the value.
     * @description Read each char and returns the found functions in a specific format.
     */
    public async parseFileContent(content: string, log: boolean = false): Promise<Function[]> {
        let result: Function[] = [];
        let i = 0;

        const attributeFunctions = new Set(
            Object.values(this.map.getDatas)
                .filter(fn => fn.type === FunctionTypes.ATTRIBUTE)
                .map(fn => fn.name)
        );

        while (i < content.length) {
            if (content.startsWith("$c[", i)) {
                let end = this.findClosingBracket(content, i);
                if (end !== -1) i = end;
                i++;
                continue;
            } else if (content.startsWith("$c", i)) {
                while (i < content.length && content[i] !== "\n") i++;
                i++;
                continue;
            }

            if (content[i] === "$") {
                let endIndex = i + 1;
                while (endIndex < content.length && /[a-zA-Z0-9_]/.test(content[endIndex])) endIndex++;

                let functionName = content.substring(i, endIndex);
                i = endIndex;

                let opened = true;
                let closed = true;

                if (attributeFunctions.has(functionName)) {
                    opened = false;
                    closed = false;
                }

                if (i < content.length && content[i] === "[") {
                    let bracketDepth = 1;
                    let argsStart = ++i;
                    while (i < content.length && bracketDepth > 0) {
                        if (content[i] === "[") bracketDepth++;
                        if (content[i] === "]") bracketDepth--;
                        i++;
                    }
                    let argsContent = content.substring(argsStart, i - 1);

                    let subFunctions = (await this.parseFileContent(argsContent)).filter(fn => fn.name.startsWith("$"));
                    result.push(new Function(functionName, argsContent, subFunctions, opened, closed));
                } else {
                    result.push(new Function(functionName, null, [], opened, closed));
                }
            }
            i++;
        }

        if (log) console.log(result);
        return result;
    }


        /**
     *
     * @param content The content to analyze.
     * @param startIndex it starts searching at the position the program was in the parseFileContent function.
     * @private
     * @returns The requested index (-1 if not found).
     */
    private findClosingBracket(content: string, startIndex: number): number {
        let depth = 1;
        for (let i = startIndex + 1; i < content.length; i++) {
            if (content[i] === "[") depth++;
            else if (content[i] === "]") {
                depth--;
                if (depth === 0) return i;
            }
        }
        return -1;
    }

    /**
     *
     * @param content The content of the file.
     * @returns Nothing.
     * @description Execute every function who have been found.
     */
    public async execute(content: string): Promise<void> {
        const parsedFunctions = await this.parseFileContent(content);

        for (const func of parsedFunctions) {
            await this.executeFunc(func);
        }
    }

    /**
     *
     * @param func The data's of a function to run.
     * @returns Nothing.
     * @description It executes a function.
     */
    public async executeFunc(func: Function): Promise<any> {
        const replacedArgs = await func.replaceArgs(this);

        switch (func.name) {
            case "$if":
                break;
            case "$elif":
                break;
            case "$else":
                break;
            case "$while":
                break;
            case "$import":
                break;
            case "$export":
                break;
            case "$func":
                break;
            case "$end":
                break;
            default:
                return this.map.getCommandData(func.name)?.run(this, ...replacedArgs);
        }
    }


}
