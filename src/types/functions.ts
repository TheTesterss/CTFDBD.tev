export interface Function {
    name: string; // ? The name of the function.
    description: string; // ? What does the function do?
    args: Arg[]; // ? Arguments of the command.
    // ? Those who starts with ... means that the amount of arguments is not defined.
    // ? The required functions means that an error will be shown in case user gave less args.
    type: FunctionType; // ? Checks if the function needs brackets or no.
    lib: string | null; // The library the command is from or null if it's a default function.
    run: (...args: any[]) => any; // The function to call to execute the function code.
}

export interface Arg {
    name: string;
    required?: boolean;
}

export type FunctionType = "METHOD" | "ATTRIBUTE";
export enum FunctionTypes {
    METHOD = "METHOD",
    ATTRIBUTE = "ATTRIBUTE"
}

export interface FunctionParsing {
    name: string;
    opened: boolean;
    closed: boolean;
    args: string | null;
    subFunctions: FunctionParsing[];
    line: number;
}
