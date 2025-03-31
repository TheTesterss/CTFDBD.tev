import CommandExecutor from "../core/CommandExecutor";

export default class Function {
    name: string;
    args: string | null;
    subFunctions: Function[];
    opened: boolean;
    closed: boolean;

    constructor(name: string, args: string | null = null, subFunctions: Function[] = [], opened: boolean = false, closed: boolean = false) {
        this.name = name;
        this.args = args;
        this.subFunctions = subFunctions;
        this.opened = opened;
        this.closed = closed;
    }

    /**
     *
     * @param executor
     * @returns It corrects the function and executes it.
     */
    async execute(executor: CommandExecutor): Promise<string> {
        const replacedArgs = await this.replaceArgs(executor);
        return executor.map.getCommandData(this.name)?.run(executor, ...replacedArgs) ?? "";
    }

    /**
     *
     * @param executor
     * @returns A promise of every split arguments once corrected.
     * @description It helps to replace and retrieve arguments from a function.
     */
    async replaceArgs(executor: CommandExecutor): Promise<string[]> {
        if (!this.args) return [];
        let replacedArgs = this.args;

        for (const subFunction of this.subFunctions) {
            const subResult = await subFunction.execute(executor);
            const subFunctionString = await subFunction.toString();
            replacedArgs = replacedArgs.replace(subFunctionString, subResult);
        }

        return replacedArgs.split(";").map(arg => arg.trim());
    }



    /**
     *
     * @returns A promise of the function in its string format "$log[a]" for example.
     */
    async toString(): Promise<string> {
        let result = this.name;
        if (this.opened) result += "[";
        if (this.args) result += this.args;
        if (this.closed) result += "]";
        return result;
    }
}