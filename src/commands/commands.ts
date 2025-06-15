import { User } from "../lib/db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;

export type CommandsRegistry = Record<string, CommandHandler>

export function registerCommand(registry: CommandsRegistry, cmdName: string, handler: CommandHandler) {
    registry[cmdName] = handler
}


export async function runCommand(registry: CommandsRegistry, cmdName: string, ...args: string[]) {
    const handler = registry[cmdName]
    if (handler) {
       await handler(cmdName, ...args)
    } else {
        throw new Error(`Command ${cmdName} not found`)
    }
}