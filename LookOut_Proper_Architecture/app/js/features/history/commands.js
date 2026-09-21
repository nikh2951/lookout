export class Command {
    execute() {
        throw new Error("Command.execute() must be implemented.");
    }

    undo() {
        throw new Error("Command.undo() must be implemented.");
    }
}
