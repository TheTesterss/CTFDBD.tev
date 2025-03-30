import Self from "../../main";
import { Command, Option } from "../../types/commands";
import commands from "../../util/json/commands.json";
import loadOption from "../../util/loadOption";
import { generateIntro } from "../../util/texts";
import { blue, green, yellow } from "../colors";

/**
 *
 * @param self The main file.
 * @param args A list of every command arguments/options.
 * @returns Nothing.
 * @description Shows message about how to use commands or a specific one.
 */
export default (self: Self, args: string[]): void => {
    const command = commands.find((cmd: Command) => cmd.name === "help");
    let option: string | null = null;
    for (const arg of command?.options ?? []) {
        if (args.includes(arg.name)) {
            option = arg.name;
            break;
        }
    }

    if (option) loadOption(command as Command, option as unknown as string);
    else if (
        args[0] &&
        args[0].split("=")[0] === "name" &&
        commands.some((cmd: Command) => cmd.name === args[0].split("=")[1])
    ) {
        const command_1 = commands.find((cmd: Command) => cmd.name === args[0].split("=")[1]);
        loadOption(command_1 as Command, "--help");
        console.log();
        loadOption(command_1 as Command, "--usage");
        loadOption(command_1 as Command, "--option");
    } else {
        const options: string[] = [];
        for (const command_1 of commands)
            for (const option of command_1.options ?? []) if (!options.includes(option.name)) options.push(option.name);
        console.info(
            `${green(generateIntro("COMMAND OPTIONS"))} - ${options.map((opt: string) => `${blue(opt)}`).join(", ")}`
        );
        console.log();
        console.info(yellow(`${generateIntro("COMMANDS LIST")} - Available commands:`));
        for (const command_1 of commands)
            console.info(
                `${" ".repeat(32 - command_1.name.length)}${yellow(command_1.name)} | ${command_1.description}`
            );
    }
};
