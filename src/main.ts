#!/usr/bin/env node
import { Config } from "./types/config";
import fs from "node:fs";
import CommandManager from "./modules/commands";
import CommandLoader from "./core/CommandLoader";

/**
 * 
 * @description This class is about every configuration features except libraries ones.
 */
export default class Self {
    public configuration: Config = {
        files: {},
        folders: {
            commands: "./commands/"
        },
        token: ""
    }
    public configurationPath: string = ".tev.json";
    public loader: CommandLoader = new CommandLoader(this);

    constructor() {
        this.configuration = this.readConfiguration();
    }

    /**
     * 
     * @returns The configuration.
     */
    public readConfiguration(): Config {
        return JSON.parse(fs.readFileSync(this.configurationPath, { encoding: "utf-8" }));
    }

    /**
     * 
     * @returns A promise with the configuration after being updated.
     */
    public async save(): Promise<Config> {
        fs.writeFileSync(this.configurationPath, JSON.stringify(this.configuration, null, 2), { encoding: "utf-8" });
        return this.readConfiguration();
    }

    /**
     * 
     * @returns Nothing.
     * @description Executes every files the getFiles() function has found.
     */
    public async run(): Promise<void> {
        const files = await this.loader.getFiles();
        files.forEach(async (file: string) => await this.loader.loadFile(file));
    }
}

const self = new Self();
CommandManager(self);