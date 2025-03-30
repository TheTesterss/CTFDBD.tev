import { Library } from "./library";

export interface Config {
    name?: string; // ? Used when importations will be available.
    description?: string; // ? To describe the library.
    version?: string; // ? Following pattern "V^0.0.0", library version.
    libs?: Library[]; // ? All the downloaded libraries.
    folders: FoldersEnumeration; // ? The necessary folders.
    files: FilesEnumeration; // ? The necessary files.
    token: string; // ? The bot token.
}

export interface FoldersEnumeration {
    commands: string; // ? Path to claim the commands & events folder.
}

export interface FilesEnumeration {
    variables?: string; // ? Path to claim the program variables.
    status?: string; // ? Path to claim the bot status.
    commands?: string; // ? Path to claim the contexts & slashs commands datas.
}
