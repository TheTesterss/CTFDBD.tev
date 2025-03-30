import { Function, FunctionTypes } from "../../../../types/functions";
import CommandExecutor from "../../../CommandExecutor";

export const $log = {
    name: "$log",
    description: "Prints something into the console.",
    type: FunctionTypes.METHOD,
    lib: null,
    args: [{ name: "content", required: true }],
    run: (executor: CommandExecutor, content: any) => {
        console.log(content);
    }
} as Function;
