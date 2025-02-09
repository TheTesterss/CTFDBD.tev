import Self from "../main";

export default class CommandExecutor {
    public self: Self;

    constructor(self: Self) {
        this.self = self;
    }

    public async parseFileContent(content: string): Promise<string[]> {
        const contents = content.split("\n");
        console.log(contents)
        return contents;
    }

    public async execute(content: string[]): Promise<void> {

    }
}