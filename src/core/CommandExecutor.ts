import Self from "../main";
import CommandMap from "./CommandMap";
import { FunctionParsing } from "../types/functions";
import { generateIntro } from "../util/texts";
import { red } from "../modules/colors";
import getLastAtLine from "../util/getLastAtLine";

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
     * @returns An object with the index as the key and the function datas as the value.
     * @description Read each char and returns the found functions in a specific format.
     */
    public async parseFileContent(content: string, log: boolean = false): Promise<Array<FunctionParsing>> {
        // name
        // opened
        // closed
        // args
        // subFunctions

        let result: Array<FunctionParsing> = [];
        let currentValue: string = ""; // The current string can be neither the function or the argument of a function.
        let stack: null[] = []; // A new null value means a new "[" appears and the next "]" is gonna remove it (Pile).
        let functionIndex: number = 0; // Index to ensure unique keys for functions
        let line: number = 0; // Index every function's line.

        for (let i = 0; i < content.length; i++) {
            // Different cases:
            //   => A space not inside of a function nor at the starts of the function will be replaced by nothing (spaces are including \t and \n).
            //      => TIPS: Verifying the current stocked function to check if its not empty so I can place it in the result as a retrieved function.
            //   => A [ means the actual found function is a method and need to stock the arguments until its closed.
            //      => ERROR: The function it opens doesn't exist.
            //      => ERROR: No function before the opening.
            //      => ERROR: Its never closed.
            //      => TIPS: Forgetting the current function because its not an attribute.
            //   => A ] means the last opened function is closed.
            //      => ERROR: Nothing to close.
            //   => A $ means a new function is gonna be added.
            //      => TIPS: Method handling? Adds into the stack variable a new element waiting to be closed.
            //      => TIPS: Attribute handling? Wait until a space, a line return or an another $
            //      => TIPS: Verifying the current stocked function to check if its not empty so I can place it in the result as a retrieved function.

            switch (content[i]) {
                case "$":
                    // In the case its an argument inside of a function.
                    if (stack.length > 0) currentValue += "$";
                    // Otherwise starts the function from there.
                    else {
                        if (currentValue.trim() !== "" && currentValue.startsWith("$")) {
                            result.push({
                                name: currentValue,
                                opened: false,
                                closed: false,
                                args: null,
                                subFunctions: [],
                                line
                            });
                            functionIndex++;
                        }
                        currentValue = "$";
                    }
                    break;
                case "[":
                    if (stack.length > 0) {
                        currentValue += "[";
                        stack.push(null);
                    } else if (!currentValue.startsWith("$")) {
                        // In the case its not a function before, go to the next ] and ignores the arguments.
                        // In the case its a commentary just skip it.
                        currentValue = "";
                        while (i < content.length && content[i] !== "]") i++;
                    } else {
                        // A new bracket opened so we push into the stack variable. We also add the function before to the result. It resets the currents function and value.
                        stack.push(null);
                        result.push({
                            name: currentValue,
                            opened: true,
                            closed: false,
                            args: "",
                            subFunctions: [],
                            line
                        });
                        functionIndex++;
                        currentValue = "";
                    }
                    break;
                case "]":
                    // In the case it ends but no opened bracket found before, we just reset everything we save on currentValue.
                    if (stack.length === 0) currentValue = "";
                    // It drops the last opened bracket and sets the actual value as the argument of the last stocked function. It, at the end resets the current value.
                    else {
                        stack.pop();
                        // * We complete the informations about the current command.
                        if (stack.length === 0) {
                            const r = result[functionIndex - 1];
                            const subFunctions = await this.parseFileContent(currentValue);
                            result[functionIndex - 1] = {
                                name: r.name,
                                opened: true,
                                closed: true,
                                args: currentValue,
                                subFunctions,
                                line: r.line
                            };
                            currentValue = "";
                        } else {
                            currentValue += "]";
                        }
                    }
                    break;
                case " ":
                case "\t":
                case "\n":
                case "\r":
                    // In the case of tabulations, newlines or spaces. We check if its not out of an argument because it will not be interpreted but also if it's not at the start of an argument (can cause trouble while logging or in the future sending content to discord).
                    if (stack.length === 0 || currentValue.trim() === "") {
                        if (currentValue.startsWith("$")) {
                            result[functionIndex] = {
                                name: currentValue,
                                opened: false,
                                closed: false,
                                args: null,
                                subFunctions: [],
                                line
                            };
                        }
                        continue;
                    }
                    // In the other case its a normal char who's parsed the same as the others.
                    else currentValue += content[i];
                    break;
                default:
                    // We each time add the current char but also verify the case where the current value is an existing function who means it may be interpreted in some cases.
                    currentValue += content[i];
                    break;
            }
        }

        // ? Avoid a forgotten function at the end.
        if (currentValue.trim() !== "" && currentValue.startsWith("$")) {
            result[functionIndex] = {
                name: currentValue,
                opened: false,
                closed: false,
                args: null,
                subFunctions: [],
                line
            };
        }

        if (log) console.log(result);
        return result;
    }

    /**
     *
     * @param content The content of the file.
     * @returns Nothing.
     * @description Execute every function who have been found.
     */
    public async execute(content: string): Promise<void> {
        const parsedContent = await this.parseFileContent(content, false);
        parsedContent.forEach(async (value: FunctionParsing, i: number) => {
            const r = await this.filterAttribute(value);
            if (r) {
                parsedContent[i] = r as unknown as FunctionParsing;
            }
        });
        parsedContent
            .filter((value: FunctionParsing) => value.name === "$c")
            .forEach((_: FunctionParsing, i: number) => parsedContent.slice(
                i,
                parsedContent.indexOf(getLastAtLine(parsedContent.slice(i)), i)+1
            ));

        // ? executing each functions in the order they've been found.
        for (let i = 0; i < parsedContent.length; i++) {
            await this.executeFunc(parsedContent[i]);
        }
    }

    /**
     *
     * @param f The datas of an attribute function to run.
     * @returns Nothing.
     * @description It executes a function.
     */
    public async executeFunc(f: FunctionParsing): Promise<any> {
        if(f.subFunctions.length > 0) f = await this.replaceArgs(f);
        const retrievedArguments: any[] = !f.args ? [] : await this.retrieveArguments(f);

        switch (f.name) {
            case "$if":
                break;
            case "$elseif":
                break;
            case "$else":
                break;
            case "$import":
                break;
            case "$func":
                break;
            case "$while":
                break;
            case "$end":
                if (this.stack.length === 0)
                    throw new Error(
                        `${red(generateIntro("ENDED BLOCK ERROR"))} - The ${red("$end")} cannot be used as there's no block to end`
                    );
                this.stack.pop();
                break;
            default:
                return this.map.getCommandData(f.name)?.run(this, ...retrievedArguments);
        }
    }

    /**
     *
     * @param f The datas of an attribute function to check existency.
     * @returns null in case it doesn't exists, the updated function once the name is corrected.
     */
    public async filterAttribute(f: FunctionParsing): Promise<FunctionParsing | null> {
        let name = f.name;
        for (let i = name.length - 1; i >= 0; i--) {
            if (this.map.exists(name)) break;
        }
        if (name === "") return null;
        f.name = name;
        return f;
    }

    /**
     *
     * @param f The datas of a method function to retrieve its arguments.
     * @returns The list of every found arguments (each split by a ;).
     */
    public async retrieveArguments(f: FunctionParsing): Promise<Array<string>> {
        const r: string[] = [];
        f.args = f.args as string;
        let currentValue: string = "";
        for (let i = 0; i < f.args.length; i++) {
            switch (f.args[i]) {
                case ";":
                    r.push(currentValue);
                    currentValue = "";
                    break;
                default:
                    currentValue += f.args[i];
                    break;
            }
        }
        if (currentValue.trim() !== "") r.push(currentValue);
        return r;
    }

    /**
     *
     * @param f The datas of a method function to replace its arguments.
     * @returns the function itself once the argument is fully corrected.
     */
    public async replaceArgs(f: FunctionParsing): Promise<FunctionParsing> {
        // TAKES A FUNCTION ONCE PARSED
        // name         = "$...."
        // opened       = true/false
        // closed       = true/false
        // args         = "a$...[...]b"/null
        // subFunctions =
        //       name         = "$...."
        //       opened       = true/false
        //       closed       = true/false
        //       args         = "a$...[...]b"/null
        //       subFunctions = ...

        // THE GOAL IS TO REPLACE A FUNCTION DEPENDING ON ITS COMPOSITION AND RETURN IT AT THE END.
        // SO AT THE END I RETURN THE FUNCTION ONCE I UPDATED THE ARG
        //
        f.args = await this.getStringForSubFunction(f);
        return f;
    }

    public async getStringForSubFunction(f: FunctionParsing): Promise<string> {
        let result: string = "";
        result += f.name;
        if (f.opened) result += "[";
        for (const subFunction of f.subFunctions) {
            f.args = f.args as string;
            result += f.args.replace(
                await this.getStringForSubFunction(subFunction),
                await this.executeFunc(subFunction)
            );
        }
        if (f.closed) result += "]";
        return result;
    }
}
