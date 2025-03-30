import { blue, green, red, yellow } from "../modules/colors";
import { Command } from "../types/commands";
import { generateIntro } from "./texts";

/**
 *
 * @param command The executed command.
 * @param option The executed option.
 * @returns Nothing.
 * @description Execute the asked option for the given command.
 */
export default (command: Command, option: string): void => {
    switch (option) {
        case "--help":
            console.info(
                `${blue(generateIntro("COMMAND DESCRIPTION"))} - ${command.description ?? "No given description."}`
            );
            break;
        case "--usage":
            if (!command.usages || command.usages.length === 0)
                console.warn(
                    `${yellow(generateIntro("COMMAND USAGES"))} - The command ${yellow(command.name)} has 0 usage.`
                );
            else {
                console.info(
                    `${green(generateIntro("COMMAND USAGES"))} - The command ${green(command.name)} allows ${command.usages?.length ?? 0} differents usages.`
                );
                for (let i = 0; i < command.usages.length; i++)
                    console.info(
                        `${" ".repeat(15 - i.toString().length)}${blue((i + 1).toString())} | ${command.usages[i]}`
                    );
            }
            break;
        case "--option":
            if (!command.options || command.options.length === 0)
                console.warn(
                    `${yellow(generateIntro("COMMAND OPTIONS"))} - The command ${yellow(command.name)} has 0 option.`
                );
            else {
                console.info(
                    `${green(generateIntro("COMMAND USAGES"))} - The command ${green(command.name)} allows ${command.options?.length ?? 0} differents options.`
                );
                for (let i = 0; i < command.options.length; i++)
                    console.info(
                        `${" ".repeat(15 - i.toString().length)}${blue((i + 1).toString())} | ${command.options[i].name}`
                    );
            }
            break;
        default:
            console.error(
                `${red(generateIntro("COMMAND ERROR"))} - An error occured while executing ${command.name} option.`
            );
            break;
    }
};
