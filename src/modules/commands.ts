import Self from "../main";
import { Command } from "../types/commands";
import commands from "../util/json/commands.json";

/**
 * 
 * @param self the main file.
 * @returns Nothing.
 * @description Executes the given command with an existing command if there is a match.
 */
export default (self: Self): void => {
    const command = process.argv.slice(2);
    if(commands.some((cmd: Command) => cmd.name === command[0])) {
        const cmd = require(`./commands/${command[0]}`).default;
        cmd(self, command.slice(1));
    }
}