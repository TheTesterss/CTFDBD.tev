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
 * @description Run the configurated folder.
 */
export default async (self: Self, args: string[]): Promise<void> => {
    const command = commands.find((cmd: Command) => cmd.name === "run");
    let option: string | null = null;
    for (const arg of command?.options ?? []) {
        if (args.includes(arg.name)) {
            option = arg.name;
            break;
        }
    }

    if (option) loadOption(command as Command, option as unknown as string);
    else {
        await self.run();
    }
};
