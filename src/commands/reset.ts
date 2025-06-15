
import { truncateUsers } from "../lib/db/queries/users";

export type CommandHandler = (cmdName: string, ...args: string[]) => Promise<void>;


export async function handlerReset(cmdName: string, ...args: string[]) {
    try {
        await truncateUsers();
        console.log("Truncated the users table")
    } catch (err: unknown) {
        if(err instanceof Error) {
            console.log(`Failed to delete users: ${err.message}`)
        } else {
            console.log(`Failed to delete users: ${err}`)
        }
        return 
    }
   
}