import { red } from "../modules/colors";
import { Function, FunctionTypes } from "../types/functions";
import { generateIntro } from "../util/texts";
import * as methods from "./functions/default/index";

export default class CommandMap {
    private commands: Record<string, Function> = {
        // ? Default methods
        //      => Console.
        $log: methods.$log,

        //      => Variables.
        $var: methods.$var,
        $get: methods.$get,

        $ping: {
            name: "$ping",
            type: FunctionTypes.ATTRIBUTE,
            description: "Returns the current ping",
            args: [],
            lib: null,
            run: () => 0
        }

        // ? Default attributes

        // ? Testing functions
        // $checkCondition: util.$checkCondition
    };

    constructor() {}

    /**
     *
     * @returns The commands usable in this file.
     */
    public get getDatas(): Record<string, Function> {
        return this.commands;
    }
    /**
     *
     * @description Sets the usable commands for this file.
     */
    public set setDatas(d: Record<string, Function>) {
        this.commands = d;
    }

    /**
     *
     * @param name The name of the function you're looking for.
     * @returns The informations of the function or null if no function exists.
     */
    public getCommandData(name: string): Function | null {
        return this.commands[name];
    }

    /**
     *
     * @param name The name of the function you're looking for.
     * @returns true/false depending on whether the function is in the record.
     */
    public exists(name: string): boolean {
        return this.commands[name] ? true : false;
    }

    /**
     *
     * @param f The function to add.
     * @returns The functions list once updated.
     */
    public addCommand(f: Function): Record<string, Function> {
        if (this.commands[f.name])
            throw new Error(
                `${red(generateIntro("IMPORTATION ERROR"))} - Cannot import ${red(f.name)} because an another function already exists at this name.`
            );
        this.commands[f.name] = f;
        return this.commands;
    }

    /**
     *
     * @param f The name of the function to remove.
     * @returns The functions list once updated.
     */
    public removeCommand(name: string): Record<string, Function> {
        if (!this.commands[name])
            throw new Error(
                `${red(generateIntro("IMPORTATION ERROR"))} - Cannot remove ${red(name)} because nor function exists at this name.`
            );
        delete this.commands[name];
        return this.commands;
    }

    /**
     *
     * @returns The functions list once updated.
     * @description It deletes every imported functions.
     */
    public resetCommands(): Record<string, Function> {
        for (const command in this.commands) if (this.commands[command].lib) this.removeCommand(command);
        return this.commands;
    }

    /**
     *
     * @param lib The name of the library.
     * @returns The functions imported from the library.
     */
    public getFromLib(lib: string | null): Record<string, Function> {
        const result: Record<string, Function> = {};
        for (const command in this.commands)
            if ((lib && this.commands[command].lib === lib) || (!lib && !this.commands[command].lib))
                result[command] = this.commands[command];
        return result;
    }
}
