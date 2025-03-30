import Self from "../main";
import CommandExecutor from "./CommandExecutor";
import fs from "node:fs";
import path from "node:path";

export default class CommandLoader {
    public self: Self;

    constructor(self: Self) {
        this.self = self;
    }

    /**
     *
     * @param folder If launching an another folder than the configurated one.
     * @returns The paths of every file located in this folder.
     * @description Use recursivity to allow user to put a file below 100 folders if necessary.
     */
    public async getFiles(folder?: string): Promise<string[]> {
        if (!folder) folder = this.self.readConfiguration().folders.commands;

        const processItems = async (items: string[], dir: string): Promise<void> => {
            for (const item of items) {
                const currentPath: string = path.join(dir, item);
                if (fs.statSync(currentPath).isDirectory())
                    await processItems(fs.readdirSync(currentPath), currentPath);
                else {
                    filesPaths.push(currentPath);
                }
            }
        };

        const filesPaths: string[] = [];
        await processItems(fs.readdirSync(folder), folder);
        return filesPaths;
    }

    /**
     *
     * @param file the file to load
     * @returns Nothing
     * @description It initializates a new executor for each file.
     */
    public async loadFile(file: string): Promise<void> {
        const executor: CommandExecutor = new CommandExecutor(this.self);
        await executor.execute(fs.readFileSync(file, { encoding: "utf-8" }));
    }
}
