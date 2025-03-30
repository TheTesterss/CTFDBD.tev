import Self from "../main";
import { Library as Lib } from "../types/library";
import * as Libs from "../util/json/defaultLibs.json";
import { generateIntro } from "../util/texts";
import { red, yellow } from "./colors";

export default class LibrariesManager {
    public self: Self;
    public downloaded: Lib[] = [];
    public libraries: Lib[] = Libs;

    constructor(self: Self) {
        this.self = self;
        for (const lib of this.self.configuration.libs ?? []) {
            this.download(lib);
        }
    }

    /**
     *
     * @param x a library or the name of a library.
     * @returns true/false depending on the already downloaded libraries and the available and downloadable libraries.
     */
    public isDownloadable(x: Lib | string): boolean {
        return (
            this.libraries.some((lib: Lib) => lib.name === x || lib === x) &&
            !this.downloaded.some((lib: Lib) => lib.name === x || lib === x)
        );
    }

    /**
     *
     * @param x a library or the name of a library.
     * @returns true/false depending on the already downloaded libraries and the available and downloadable libraries.
     */
    public isUndownloadable(x: Lib | string): boolean {
        return this.libraries.some((lib: Lib) => lib.name === x) && this.downloaded.some((lib: Lib) => lib.name === x);
    }

    /**
     *
     * @param x a library or the name of a library.
     * @returns A list with the downloaded libraries and the added library.
     */
    public async download(x: Lib | string): Promise<[Lib[], Lib]> {
        if (!this.isDownloadable(x))
            console.warn(
                `${yellow(generateIntro("ERROR"))} - Oops, it seems like ${yellow(typeof x === "string" ? x : x.name)} cannot be downloaded!`
            );
        this.downloaded.push(this.libraries.find((lib: Lib) => lib.name === x || lib === x)!);
        await this.save();
        return [this.downloaded, this.downloaded.find((lib: Lib) => lib.name === x || lib === x)!];
    }

    /**
     *
     * @param x a library or the name of a library.
     * @returns A list with the downloaded libraries and the removed library.
     */
    public async undownload(x: Lib | string): Promise<[Lib[], Lib]> {
        if (!this.isUndownloadable(x))
            console.warn(
                `${yellow(generateIntro("LIBRARY ERROR"))} - Oops, it seems like ${yellow(typeof x === "string" ? x : x.name)} cannot be undownloaded!`
            );
        this.downloaded.push(this.libraries.find((lib: Lib) => lib.name === x || lib === x)!);
        await this.save();
        return [this.downloaded, this.libraries.find((lib: Lib) => lib.name === x || lib === x)!];
    }

    /**
     *
     * @returns Nothing.
     */
    public async save(): Promise<void> {
        this.self.configuration.libs = this.downloaded;
        this.self.save();
    }
}
