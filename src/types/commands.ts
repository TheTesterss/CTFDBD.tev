export interface Command {
    name: string; // ? The name of the command.
    description?: string; // ? What does the command do?
    availableArgs?: Arg[]; // ? Every arguments you may use with this command.
    usages?: string[]; // ? Every single usage of the command.
    options?: Option[]; // Every options you can use with this command.
}

export interface Option {
    name: string; // ? The name of the option.
    description?: string; // ? What does the option do?
}

export interface Arg {
    name: string; // ? The name of the argument.
    description?: string; // ? What does the argument do?
    waitingForResponse?: boolean; // ? Is the argument waiting for a response?
    // TRUE  -> tev account username=string password=string
    // FALSE -> tev init .tev.json  
}