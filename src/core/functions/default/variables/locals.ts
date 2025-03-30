import { Function, FunctionTypes } from "../../../../types/functions";
import CommandExecutor from "../../../CommandExecutor";

export const LocalsVariablesContainer: { [key: string]: any } = {};

export const $var = {
    name: "$var",
    description: "Sets a value to a key (overwrites if key string already used).",
    type: FunctionTypes.METHOD,
    lib: null,
    args: [
        { name: "key", required: true },
        { name: "value", required: true }
    ],
    run: (executor: CommandExecutor, key: string, value: any) => {
        LocalsVariablesContainer[key] = value;
    }
} as Function;

export const $get = {
    name: "$get",
    description: "Returns the value for a specified key.",
    type: FunctionTypes.METHOD,
    lib: null,
    args: [{ name: "key", required: true }],
    run: (executor: CommandExecutor, key: string): any => {
        return LocalsVariablesContainer[key] ?? "N/A";
    }
} as Function;
